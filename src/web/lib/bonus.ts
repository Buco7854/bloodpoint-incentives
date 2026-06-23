export type BonusTier = 'none' | 'low' | 'mid' | 'high' | 'max';

/** Maps a bonus percentage onto a warm -> hot intensity tier for the colour ramp. */
export function bonusTier(percent: number): BonusTier {
  if (percent <= 0) return 'none';
  if (percent < 25) return 'low';
  if (percent < 75) return 'mid';
  if (percent < 150) return 'high';
  return 'max';
}
