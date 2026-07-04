import { delay } from '../../common/async.js';
import type { Logger } from '../../common/logger.js';
import type { AuthProvider } from '../auth/types.js';
import type { AnchorResolver } from '../bhvr/anchor.js';
import type { RateGate } from '../bhvr/rateGate.js';
import type { HubClient } from '../hubClient.js';
import type { VersionResolver } from '../version/resolver.js';
import { type ContentDeps, fetchBonusPointEvents, resolveCdnRoot } from './content.js';

export interface EventPollerOptions {
  /** How often to re-fetch the schedule (ms). */
  intervalMs: number;
  content: ContentDeps;
}

/**
 * Periodically fetches BHVR's global Bloodpoint-event schedule and pushes it to the
 * hub. Best-effort: reuses the login anchor + session key, respects the BHVR rate
 * gate, and never throws fatally, so a failed refresh can't disturb region polling.
 */
export class EventPoller {
  private readonly controller = new AbortController();
  private loopDone: Promise<void> | null = null;

  constructor(
    private readonly hub: HubClient,
    private readonly provider: AuthProvider,
    private readonly anchorResolver: AnchorResolver,
    private readonly resolver: VersionResolver,
    private readonly rateGate: RateGate,
    private readonly options: EventPollerOptions,
    private readonly log: Logger,
  ) {}

  start(): void {
    if (!this.loopDone) this.loopDone = this.run();
  }

  async stop(): Promise<void> {
    this.controller.abort();
    await this.loopDone;
  }

  private get signal(): AbortSignal {
    return this.controller.signal;
  }

  private async run(): Promise<void> {
    this.log.info('bonus-event poller started');
    while (!this.signal.aborted) {
      try {
        await this.refreshOnce();
      } catch (err) {
        this.log.warn({ err }, 'bonus-event refresh failed; will retry next cycle');
      }
      await delay(this.options.intervalMs, this.signal);
    }
    this.log.info('bonus-event poller stopped');
  }

  private async refreshOnce(): Promise<void> {
    const version = this.resolver.getActive();
    if (!version) {
      this.log.debug('no client version resolved yet; skipping event refresh');
      return;
    }
    const userAgent = version.userAgent;
    const anchor = await this.anchorResolver.getAnchor(userAgent);
    const apiKey = await this.provider.getApiKey();

    await this.rateGate.wait(this.signal);
    const cdnRoot = await resolveCdnRoot(this.options.content, apiKey, anchor.pattern, userAgent, this.signal);
    await this.rateGate.wait(this.signal);
    const events = await fetchBonusPointEvents(
      this.options.content,
      cdnRoot,
      anchor.contentVersionId,
      anchor.secretKey,
      userAgent,
      this.signal,
    );

    await this.hub.reportEvents(events, this.signal);

    const now = Date.now();
    const active = events.find((e) => now >= Date.parse(e.startsAt) && now < Date.parse(e.endsAt));
    this.log.info(
      { total: events.length, active: active ? `${active.label} x${active.multiplier}` : 'none' },
      'refreshed bonus-point events',
    );
  }
}
