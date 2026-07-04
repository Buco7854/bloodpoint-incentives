import type { Role } from './types.js';

/**
 * A matchIncentives response is real only when `ratio !== 0`. A wrong
 * category/platform or throttling doesn't error; it returns a constant
 * placeholder (typically survivor:200 / killer:0 / ratio:0) that must never be
 * shown as live data.
 */
export function isRealResponse(ratio: number): boolean {
  return Number.isFinite(ratio) && ratio !== 0;
}

/** Bonus percent -> multiplier. 75 => 1.75, 0 => 1, 100 => 2. */
export function multiplier(percent: number): number {
  return 1 + percent / 100;
}

/** The role that currently carries the bonus, or null when neither does. */
export function headlineRole(survivor: number, killer: number): Role | null {
  if (survivor <= 0 && killer <= 0) return null;
  return killer > survivor ? 'killer' : 'survivor';
}

/** The headline number = the higher of the two roles' bonus percentages. */
export function headlinePercent(survivor: number, killer: number): number {
  return Math.max(survivor, killer);
}

/** Bonus percent a global event contributes; additive, so multiplier `m` gives (m-1)*100. */
export function eventBonusPercent(multiplier: number): number {
  if (!Number.isFinite(multiplier) || multiplier <= 1) return 0;
  return (multiplier - 1) * 100;
}

/** Total multiplier for the headline role: base + queue bonus + event bonus, all additive. */
export function totalMultiplier(queuePercent: number, eventMultiplier: number | null): number {
  const event = eventMultiplier == null ? 0 : eventBonusPercent(eventMultiplier);
  return 1 + Math.max(0, queuePercent) / 100 + event / 100;
}
