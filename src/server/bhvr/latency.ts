import { ALL_REGION_IDS } from '../../shared/regions.js';
import { randInt } from '../util/async.js';

export interface LatencyEntry {
  latency: number;
  regionName: string;
}

/**
 * Builds a plausible `latencies` array that steers BHVR to the target region by
 * giving it the lowest ping. Always reports all 15 regions like a real client:
 * the target at a realistic low (18-45 ms), the rest higher and varied
 * (70-280 ms). No synthetic 1/9999 tells.
 */
export function buildLatencies(
  targetRegion: string,
  regions: readonly string[] = ALL_REGION_IDS,
): LatencyEntry[] {
  return regions.map((regionName) => ({
    regionName,
    latency: regionName === targetRegion ? randInt(18, 45) : randInt(70, 280),
  }));
}
