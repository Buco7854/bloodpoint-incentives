import { headlinePercent, headlineRole } from '@shared/incentive';
import type { RegionIncentive, Role } from '@shared/types';

export type BonusTier = 'none' | 'low' | 'mid' | 'high' | 'max';

/** Maps a bonus percentage onto a warm -> hot intensity tier for the colour ramp. */
export function bonusTier(percent: number): BonusTier {
  if (percent <= 0) return 'none';
  if (percent < 25) return 'low';
  if (percent < 75) return 'mid';
  if (percent < 150) return 'high';
  return 'max';
}

export interface RegionView {
  activeRole: Role | null;
  headline: number;
  tier: BonusTier;
}

export function regionView(r: RegionIncentive): RegionView {
  const headline = headlinePercent(r.survivor, r.killer);
  return {
    activeRole: headlineRole(r.survivor, r.killer),
    headline,
    tier: bonusTier(headline),
  };
}
