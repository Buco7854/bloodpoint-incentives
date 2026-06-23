import { getRegionMeta } from '../../shared/regions.js';
import type { IncentivesPayload, PollerStatus, RegionIncentive } from '../../shared/types.js';

interface RegionState extends RegionIncentive {}

export interface CacheMeta {
  platform: string;
  provider: string;
  forcedRegion: string | null;
  refreshSeconds: number;
  pageSize: number;
}

/**
 * Server-side source of truth. The background poller writes to it; the HTTP API
 * reads snapshots from it. Browsers never reach past this cache to BHVR.
 */
export class IncentiveCache {
  private readonly regions = new Map<string, RegionState>();
  private status: PollerStatus = 'initializing';
  private statusReason: string | null = null;
  private pollStartedAt: string | null = null;
  private pollCompletedAt: string | null = null;
  private version: string | null = null;
  private category: string | null = null;

  constructor(
    private readonly meta: CacheMeta,
    regionIds: readonly string[],
  ) {
    for (const region of regionIds) {
      const info = getRegionMeta(region);
      if (!info) continue;
      this.regions.set(region, {
        region,
        displayName: info.displayName,
        flag: info.flag,
        survivor: 0,
        killer: 0,
        ratio: 0,
        isReal: false,
        stale: true,
        lastUpdated: null,
      });
    }
  }

  /** Record a real reading (ratio !== 0). Updates values and clears staleness. */
  recordReal(region: string, survivor: number, killer: number, ratio: number): void {
    const state = this.regions.get(region);
    if (!state) return;
    state.survivor = survivor;
    state.killer = killer;
    state.ratio = ratio;
    state.isReal = true;
    state.stale = false;
    state.lastUpdated = new Date().toISOString();
  }

  /** Keep the last good values but flag the region stale (fallback or failure). */
  markStale(region: string): void {
    const state = this.regions.get(region);
    if (state) state.stale = true;
  }

  setVersionInfo(version: string | null, category: string | null): void {
    this.version = version;
    this.category = category;
  }

  setStatus(status: PollerStatus, reason: string | null = null): void {
    this.status = status;
    this.statusReason = reason;
  }

  markPassStarted(): void {
    this.pollStartedAt = new Date().toISOString();
  }

  markPassCompleted(): void {
    this.pollCompletedAt = new Date().toISOString();
  }

  /** Seconds since the last completed poll pass, or null if none yet. */
  cacheAgeSeconds(now: number = Date.now()): number | null {
    if (!this.pollCompletedAt) return null;
    return Math.max(0, Math.round((now - Date.parse(this.pollCompletedAt)) / 1000));
  }

  get pollerStatus(): PollerStatus {
    return this.status;
  }

  get regionCount(): number {
    return this.regions.size;
  }

  snapshot(): IncentivesPayload {
    return {
      updatedAt: this.pollCompletedAt,
      pollStartedAt: this.pollStartedAt,
      generatedAt: new Date().toISOString(),
      platform: this.meta.platform,
      provider: this.meta.provider,
      version: this.version,
      category: this.category,
      forcedRegion: this.meta.forcedRegion,
      status: this.status,
      statusReason: this.statusReason,
      refreshSeconds: this.meta.refreshSeconds,
      pageSize: this.meta.pageSize,
      regions: [...this.regions.values()].map((r) => ({ ...r })),
    };
  }
}
