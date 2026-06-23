import type { Logger } from '../../logger.js';

const DBD_APP_ID = 381210;
const DBD_CONTENT_DEPOT = 381211; // "Dead by Daylight Content" (Windows)
const VERSION_FILE = 'DeadByDaylight/Content/Version/DeadByDaylightVersionNumber.txt';

export interface SteamCredentials {
  username: string;
  password: string;
  sharedSecret: string | null;
}

/**
 * Thin wrapper over node-steam-user. Keeps one long-lived logged-in session and
 * exposes only what we need: a web auth ticket and the depot version file.
 *
 * Note: steam-user v5 has no GetAuthTicketForWebApi(identity), so we cannot bind
 * the ticket to the "KRAKEN_DBD" identity from here. We use createAuthSessionTicket
 * as the closest available primitive; full Steam login against BHVR may therefore
 * require a future library/native primitive. Quick mode (DBD_API_KEY) is the
 * supported path meanwhile.
 */
export class SteamClient {
  private user: any = null;
  private SteamUser: any = null;
  private SteamTotp: any = null;
  private connectPromise: Promise<void> | null = null;

  constructor(
    private readonly creds: SteamCredentials,
    private readonly log: Logger,
  ) {}

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
    if (!this.connectPromise) this.connectPromise = this.doConnect();
    return this.connectPromise;
  }

  private async doConnect(): Promise<void> {
    await this.loadModules();
    const SteamUser = this.SteamUser;
    const user = new SteamUser({ autoRelogin: true, machineName: 'dbd-bloodpoint-incentive' });
    this.user = user;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const settle = (err?: Error): void => {
        if (settled) return;
        settled = true;
        if (err) reject(err);
        else resolve();
      };

      user.on('loggedOn', () => {
        try {
          user.setPersona(SteamUser.EPersonaState.Online);
        } catch {
          /* non-fatal */
        }
        this.log.info('logged into Steam');
        settle();
      });
      user.on('steamGuard', (_domain: string | null, callback: (code: string) => void) => {
        const code = this.twoFactorCode();
        if (!code) {
          settle(new Error('Steam Guard required but STEAM_SHARED_SECRET is not set'));
          return;
        }
        callback(code);
      });
      user.on('error', (err: Error & { eresult?: number }) => {
        this.log.error({ eresult: err.eresult, err }, 'Steam error');
        settle(err);
      });
      user.on('disconnected', (eresult: number, msg: string) => {
        this.log.warn({ eresult, msg }, 'Steam disconnected (auto-relogin will recover)');
      });

      user.logOn({
        accountName: this.creds.username,
        password: this.creds.password,
        twoFactorCode: this.twoFactorCode(),
      });
    });
  }

  /** Hex-encoded auth session ticket for app 381210. */
  async getWebTicketHex(): Promise<string> {
    await this.connect();
    const { sessionTicket } = await this.user.createAuthSessionTicket(DBD_APP_ID);
    return Buffer.from(sessionTicket).toString('hex');
  }

  /** Reads the latest public-branch client version string from the content depot. */
  async readVersionString(): Promise<string> {
    await this.connect();
    const { apps } = await this.user.getProductInfo([DBD_APP_ID], [], true);
    const depot = apps?.[DBD_APP_ID]?.appinfo?.depots?.[DBD_CONTENT_DEPOT];
    const pub = depot?.manifests?.public;
    const manifestGid: string | undefined = typeof pub === 'string' ? pub : pub?.gid;
    if (!manifestGid) {
      throw new Error(`could not find public manifest for depot ${DBD_CONTENT_DEPOT}`);
    }

    const manifest = await this.user.getManifest(DBD_APP_ID, DBD_CONTENT_DEPOT, manifestGid, 'public');
    const target = VERSION_FILE.replace(/\//g, '\\').toLowerCase();
    const entry = (manifest.files as Array<{ filename?: string }>).find(
      (f) => typeof f.filename === 'string' && f.filename.toLowerCase() === target,
    );
    if (!entry) throw new Error('version file not found in depot manifest');

    const { file } = await this.user.downloadFile(DBD_APP_ID, DBD_CONTENT_DEPOT, entry);
    return Buffer.from(file).toString('utf8').trim();
  }

  async shutdown(): Promise<void> {
    try {
      this.user?.logOff();
    } catch {
      /* ignore */
    }
  }
}
