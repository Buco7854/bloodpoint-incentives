import type { Logger } from '../../../common/logger.js';
import { FatalAuthError } from '../errors.js';
import { buildWebApiTicket } from './webApiTicket.js';

const DBD_APP_ID = 381210;
const DBD_CONTENT_DEPOT = 381211; // "Dead by Daylight Content" (Windows)
const VERSION_FILE = 'DeadByDaylight/Content/Version/DeadByDaylightVersionNumber.txt';

// EResults that mean the credentials/2FA are wrong (unrecoverable by retrying):
// InvalidPassword, AccountLogonDenied, AccountLoginDeniedNeedTwoFactor,
// TwoFactorCodeMismatch. Anything else (rate limit, service unavailable, network)
// is treated as transient and backed off.
const FATAL_LOGIN_ERESULTS = new Set([5, 63, 85, 88]);

const LOGIN_TIMEOUT_MS = 3 * 60_000;
const BUSY_RETRY_MS = 30_000;
/** After this long, an "in-flight" operation is considered wedged and the
 * session cycle proceeds anyway instead of deferring forever. */
const BUSY_FORCE_CYCLE_MS = 10 * 60_000;

export interface SteamCredentials {
  username: string;
  password: string;
  sharedSecret: string | null;
}

export interface SteamClientOptions {
  /** Lower bound for the randomized session-refresh interval (hours). */
  reconnectMinHours?: number;
  /** Upper bound for the randomized session-refresh interval (hours). */
  reconnectMaxHours?: number;
}

/**
 * Thin wrapper over node-steam-user. Exposes only what we need: a web auth ticket
 * and the depot version file.
 *
 * A normal client does not stay connected forever, so the session is cycled on a
 * randomized 4-6h timer (log off, then reconnect lazily on next use), reusing a
 * captured refresh token so reconnects do not re-trigger Steam Guard.
 *
 * steam-user v5 has no GetAuthTicketForWebApi, so the identity-bound web ticket
 * BHVR requires is built at the protocol level in getWebApiTicketHex (mirroring
 * SteamKit2): the same auth-session ticket bytes, but with the web-api ticket
 * type, registered via ClientAuthList with the identity in server_secret.
 */
export class SteamClient {
  private user: any = null;
  private SteamUser: any = null;
  private SteamTotp: any = null;
  private connectPromise: Promise<void> | null = null;
  private refreshToken: string | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private onCycle: (() => void) | null = null;
  private busySince: number | null = null;
  private stopped = false;
  private readonly reconnectMinHours: number;
  private readonly reconnectMaxHours: number;

  constructor(
    private readonly creds: SteamCredentials,
    private readonly log: Logger,
    options: SteamClientOptions = {},
  ) {
    this.reconnectMinHours = options.reconnectMinHours ?? 4;
    this.reconnectMaxHours = options.reconnectMaxHours ?? 6;
  }

  /** Notified whenever the session is cycled, so callers can drop derived state
   * (e.g. the DBD api-key) and re-establish it like a fresh game launch. */
  setOnSessionCycle(callback: () => void): void {
    this.onCycle = callback;
  }

  private async loadModules(): Promise<void> {
    if (!this.SteamUser) {
      const mod = await import('steam-user');
      this.SteamUser = (mod as { default?: unknown }).default ?? mod;
    }
    if (!this.SteamTotp) {
      const mod = await import('steam-totp');
      this.SteamTotp = (mod as { default?: unknown }).default ?? mod;
    }
  }

  private twoFactorCode(): string | undefined {
    if (!this.creds.sharedSecret) return undefined;
    return this.SteamTotp.generateAuthCode(this.creds.sharedSecret);
  }

  connect(): Promise<void> {
    if (!this.connectPromise) {
      // Clear the memoized promise on failure so the next caller retries fresh
      // instead of awaiting a permanently rejected (or wedged) attempt.
      const attempt = this.doConnect();
      this.connectPromise = attempt;
      attempt.catch(() => {
        if (this.connectPromise === attempt) this.connectPromise = null;
      });
    }
    return this.connectPromise;
  }

  private async doConnect(): Promise<void> {
    await this.loadModules();
    const SteamUser = this.SteamUser;
    const user = new SteamUser({ autoRelogin: true, machineName: 'dbd-bloodpoint-incentive' });
    this.user = user;

    try {
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const settle = (err?: Error): void => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (err) reject(err);
          else resolve();
        };
        timer = setTimeout(
          () => settle(new Error(`Steam login timed out after ${LOGIN_TIMEOUT_MS / 1000}s`)),
          LOGIN_TIMEOUT_MS,
        );

        user.on('refreshToken', (token: string) => {
          this.refreshToken = token;
        });
        user.on('loggedOn', () => {
          try {
            user.setPersona(SteamUser.EPersonaState.Online);
          } catch {
            /* non-fatal */
          }
          this.log.info('logged into Steam');
          this.scheduleSessionRefresh();
          settle();
        });
        user.on('steamGuard', (_domain: string | null, callback: (code: string) => void) => {
          const code = this.twoFactorCode();
          if (!code) {
            settle(new FatalAuthError('Steam Guard required but STEAM_SHARED_SECRET is not set'));
            return;
          }
          callback(code);
        });
        user.on('error', (err: Error & { eresult?: number }) => {
          this.log.error({ eresult: err.eresult, err }, 'Steam error');
          if (err.eresult !== undefined && FATAL_LOGIN_ERESULTS.has(err.eresult)) {
            settle(new FatalAuthError(`Steam login failed: ${err.message} (eresult ${err.eresult})`));
          } else {
            settle(err);
          }
        });
        user.on('disconnected', (eresult: number, msg: string) => {
          this.log.warn({ eresult, msg }, 'Steam disconnected');
        });

        // Prefer the refresh token (no Steam Guard) once we have captured one.
        if (this.refreshToken) {
          user.logOn({ refreshToken: this.refreshToken });
        } else {
          user.logOn({
            accountName: this.creds.username,
            password: this.creds.password,
            twoFactorCode: this.twoFactorCode(),
          });
        }
      });
    } catch (err) {
      silenceAndLogOff(user);
      if (this.user === user) this.user = null;
      throw err;
    }
  }

  /**
   * Hex-encoded Steam Web-API auth ticket bound to `identity` for app 381210 (the
   * headless equivalent of GetAuthTicketForWebApi). Builds the auth-session ticket
   * bytes with the web-api ticket type, registers it via ClientAuthList with the
   * identity in CMsgAuthTicket.server_secret ("str:<identity>\0"), and pads the
   * returned blob to the web-api ticket size, all mirroring SteamKit2.
   */
  async getWebApiTicketHex(identity: string): Promise<string> {
    this.busySince = Date.now();
    try {
      await this.connect();
      const user = this.user;

      const { appOwnershipTicket } = await user.getAppOwnershipTicket(DBD_APP_ID);
      const ownership: Buffer = Buffer.isBuffer(appOwnershipTicket)
        ? appOwnershipTicket
        : Buffer.from(appOwnershipTicket);
      const gcToken: Buffer = await this.takeGcToken();
      user._connectionCount = (Number(user._connectionCount) || 0) + 1;

      const ticket = buildWebApiTicket({
        gcToken,
        ownership,
        publicIp: user.publicIP,
        connectedMs: this.connectedMs(),
        connectionCount: user._connectionCount,
        identity,
      });

      // Register the ticket with the identity in server_secret.
      const entry = {
        estate: 0,
        steamid: 0,
        gameid: DBD_APP_ID,
        h_steam_pipe: user._hSteamPipe,
        ticket_crc: ticket.ticketCrc,
        ticket: ticket.authTicket,
        server_secret: ticket.serverSecret,
      };
      user._activeAuthTickets = (user._activeAuthTickets || []).filter(
        (t: { ticket_crc: number }) => t.ticket_crc !== ticket.ticketCrc,
      );
      user._activeAuthTickets.push(entry);
      await user._sendAuthList();

      return ticket.full.toString('hex');
    } finally {
      this.busySince = null;
    }
  }

  private connectedMs(): number {
    const connectTime = this.user._connectTime;
    return typeof connectTime === 'number' ? (Date.now() - connectTime) >>> 0 : 0;
  }

  private async takeGcToken(): Promise<Buffer> {
    const user = this.user;
    if (user._gcTokens?.length > 0) return user._gcTokens.splice(0, 1)[0];
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        user.removeListener('_gcTokens', onToken);
        reject(new Error('timed out waiting for a Steam GC token'));
      }, 10_000);
      const onToken = (): void => {
        clearTimeout(timer);
        resolve();
      };
      user.once('_gcTokens', onToken);
    });
    if (!user._gcTokens?.length) throw new Error('no Steam GC token available');
    return user._gcTokens.splice(0, 1)[0];
  }

  /** Reads the latest public-branch client version string from the content depot. */
  async readVersionString(): Promise<string> {
    this.busySince = Date.now();
    try {
      await this.connect();
      const { apps } = await this.user.getProductInfo([DBD_APP_ID], [], true);
      const depot = apps?.[DBD_APP_ID]?.appinfo?.depots?.[DBD_CONTENT_DEPOT];
      const pub = depot?.manifests?.public;
      const manifestGid: string | undefined = typeof pub === 'string' ? pub : pub?.gid;
      if (!manifestGid) {
        throw new Error(`could not find public manifest for depot ${DBD_CONTENT_DEPOT}`);
      }

      const manifestResult = await this.user.getManifest(
        DBD_APP_ID,
        DBD_CONTENT_DEPOT,
        manifestGid,
        'public',
      );
      // The promisified API may resolve to the manifest directly or wrap it as
      // { manifest }, depending on the steam-user version.
      const manifest = (manifestResult?.files ? manifestResult : manifestResult?.manifest) as
        | { files?: Array<{ filename?: string }> }
        | undefined;
      const files = manifest?.files;
      if (!files) throw new Error('depot manifest contained no file list');

      // Match by basename so path prefixes and separators do not matter.
      const wantedBase = VERSION_FILE.split('/').pop()?.toLowerCase();
      const entry = files.find(
        (f) =>
          typeof f.filename === 'string' &&
          f.filename.split(/[\\/]/).pop()?.toLowerCase() === wantedBase,
      );
      if (!entry) throw new Error('version file not found in depot manifest');

      const downloadResult = await this.user.downloadFile(DBD_APP_ID, DBD_CONTENT_DEPOT, entry);
      const fileBuffer = (downloadResult?.file ?? downloadResult) as Buffer | undefined;
      if (!fileBuffer) throw new Error('depot file download returned no data');
      return Buffer.from(fileBuffer).toString('utf8').trim();
    } catch (err) {
      if ((err as { eresult?: number }).eresult === 15) {
        throw new FatalAuthError(
          'Could not read the Dead by Daylight depot (AccessDenied). This Steam account ' +
            'must own Dead by Daylight (app 381210); Family Sharing does not grant depot access.',
        );
      }
      throw err;
    } finally {
      this.busySince = null;
    }
  }

  private scheduleSessionRefresh(): void {
    if (this.stopped) return;
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    const span = this.reconnectMaxHours - this.reconnectMinHours;
    const hours = this.reconnectMinHours + Math.random() * span;
    this.refreshTimer = setTimeout(() => void this.refreshSession(), hours * 3_600_000);
    this.log.info({ inHours: Number(hours.toFixed(2)) }, 'scheduled Steam session refresh');
  }

  private async refreshSession(): Promise<void> {
    if (this.stopped) return;
    if (this.busySince != null) {
      if (Date.now() - this.busySince < BUSY_FORCE_CYCLE_MS) {
        // Don't interrupt an in-flight operation; try again shortly.
        this.refreshTimer = setTimeout(() => void this.refreshSession(), BUSY_RETRY_MS);
        return;
      }
      this.log.warn(
        { busyMinutes: Math.round((Date.now() - this.busySince) / 60_000) },
        'in-flight Steam operation looks wedged; cycling the session anyway',
      );
      this.busySince = null;
    }
    this.log.info('cycling Steam session');
    this.teardown();
    this.scheduleSessionRefresh();
    // Drop the Steam connection and any derived DBD session; both re-establish
    // lazily on the next ticket/depot read, like restarting the game.
    this.onCycle?.();
  }

  private teardown(): void {
    if (this.user) silenceAndLogOff(this.user);
    this.user = null;
    this.connectPromise = null;
  }

  async shutdown(): Promise<void> {
    this.stopped = true;
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.teardown();
  }
}

/** Detach a discarded steam-user instance: drop our handlers (keeping a no-op
 * 'error' listener so a late emit cannot crash the process) and log off. */
function silenceAndLogOff(user: any): void {
  try {
    user.removeAllListeners();
    user.on('error', () => {});
    user.logOff();
  } catch {
    /* ignore */
  }
}
