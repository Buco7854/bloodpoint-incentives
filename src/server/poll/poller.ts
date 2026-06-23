import type { Logger } from '../logger.js';
import { delay, jitter } from '../util/async.js';
import { AuthError, NotImplementedError } from '../auth/errors.js';
import {
  BhvrRateLimitedError,
  BhvrServerError,
  BhvrUnauthorizedError,
  type BhvrClient,
} from '../bhvr/client.js';
import type { VersionResolver } from '../version/resolver.js';
import type { IncentiveCache } from './cache.js';

const MAX_BACKOFF = 8;
const MAX_SLEEP_MS = 20 * 60 * 1000;
const HARD_PAUSE_MS = 5 * 60 * 1000;
const PAUSE_AFTER_BAD_PASSES = 3;

export interface PollerOptions {
  regionIds: readonly string[];
  pollIntervalMs: number;
  versionRefreshMs: number;
}

/**
 * Drives BHVR traffic for a single deployment. It walks the regions round-robin,
 * one at a time, spreading each request across the poll interval with jitter so
 * it never bursts, and backs off (then pauses) when it meets resistance.
 */
export class Poller {
  private readonly controller = new AbortController();
  private loopDone: Promise<void> | null = null;
  private index = 0;
  private anyRealThisPass = false;
  private backoff = 1;
  private consecutiveBadPasses = 0;
  private lastVersionRefresh = Date.now();

  constructor(
    private readonly cache: IncentiveCache,
    private readonly client: BhvrClient,
    private readonly resolver: VersionResolver,
    private readonly options: PollerOptions,
    private readonly log: Logger,
  ) {}

  start(): void {
    if (this.loopDone) return;
    this.loopDone = this.run();
  }

  async stop(): Promise<void> {
    this.controller.abort();
    await this.loopDone;
  }

  private get signal(): AbortSignal {
    return this.controller.signal;
  }

  private get baseSlotMs(): number {
    return Math.max(1000, this.options.pollIntervalMs / this.options.regionIds.length);
  }

  private async run(): Promise<void> {
    this.log.info(
      { regions: this.options.regionIds.length, intervalMs: this.options.pollIntervalMs },
      'poller started',
    );
    while (!this.signal.aborted) {
      try {
        await this.tick();
      } catch (err) {
        this.log.error({ err }, 'unexpected poller error');
        await delay(HARD_PAUSE_MS, this.signal);
      }
    }
    this.log.info('poller stopped');
  }

  private async tick(): Promise<void> {
    if (this.index === 0) {
      this.cache.markPassStarted();
      this.anyRealThisPass = false;
    }

    const version = this.resolver.getActive();
    if (!version) {
      this.cache.setStatus('error', 'client version/category could not be resolved');
      this.log.error('no active client version; pausing and retrying discovery');
      await delay(HARD_PAUSE_MS, this.signal);
      await this.resolver.refreshFromDiscovery();
      return;
    }
    this.cache.setVersionInfo(version.version, version.category);

    const region = this.options.regionIds[this.index];
    if (region) await this.queryRegion(region, version);

    this.index = (this.index + 1) % this.options.regionIds.length;
    if (this.index === 0) await this.finishPass();

    const slot = Math.min(jitter(this.baseSlotMs * this.backoff, 0.25), MAX_SLEEP_MS);
    await delay(slot, this.signal);
  }

  private async queryRegion(region: string, version: ReturnType<VersionResolver['getActive']>): Promise<void> {
    if (!version) return;
    try {
      const read = await this.client.fetchRegion(region, version, this.signal);
      if (read.isReal) {
        this.cache.recordReal(region, read.survivor, read.killer, read.ratio);
        this.anyRealThisPass = true;
        this.backoff = Math.max(1, this.backoff * 0.5);
      } else {
        this.cache.markStale(region);
      }
    } catch (err) {
      this.cache.markStale(region);
      this.handleError(region, err);
    }
  }

  private handleError(region: string, err: unknown): void {
    if (err instanceof AuthError || err instanceof NotImplementedError) {
      this.cache.setStatus('error', err.message);
      this.log.error({ region, err }, 'authentication failed; pausing');
      this.backoff = MAX_BACKOFF;
      return;
    }
    if (err instanceof BhvrRateLimitedError) {
      this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF);
      this.cache.setStatus('paused', 'rate limited by BHVR; backing off');
      this.log.warn({ region }, 'rate limited; backing off');
      return;
    }
    if (err instanceof BhvrServerError || err instanceof BhvrUnauthorizedError) {
      this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF);
      this.log.warn({ region, err }, 'server/auth error from BHVR');
      return;
    }
    this.backoff = Math.min(this.backoff * 1.5, MAX_BACKOFF);
    this.log.warn({ region, err }, 'transient error querying region');
  }

  private async finishPass(): Promise<void> {
    this.cache.markPassCompleted();
    this.resolver.reportPassResult(this.anyRealThisPass);

    if (this.anyRealThisPass) {
      this.consecutiveBadPasses = 0;
      this.cache.setStatus('ok');
    } else {
      this.consecutiveBadPasses += 1;
      this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF);
      if (this.consecutiveBadPasses >= PAUSE_AFTER_BAD_PASSES) {
        this.cache.setStatus('paused', 'every region returned fallback repeatedly; backing off');
      } else {
        this.cache.setStatus('degraded', 'every region returned fallback this pass');
      }
    }

    if (Date.now() - this.lastVersionRefresh >= this.options.versionRefreshMs) {
      this.lastVersionRefresh = Date.now();
      this.log.info('re-resolving latest client version');
      await this.resolver.refreshFromDiscovery();
    }
  }
}
