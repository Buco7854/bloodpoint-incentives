import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  eventBonusPercent,
  headlinePercent,
  headlineRole,
  isRealResponse,
  multiplier,
  totalMultiplier,
} from './incentive.js';
import { formatMult, formatMultFixed, formatMultiplier, formatPercent, relativeTime } from './format.js';

test('isRealResponse: only non-zero ratio is real', () => {
  assert.equal(isRealResponse(3.012), true);
  assert.equal(isRealResponse(0), false); // the fallback signature
  assert.equal(isRealResponse(Number.NaN), false);
});

test('multiplier math', () => {
  assert.equal(multiplier(0), 1);
  assert.equal(multiplier(75), 1.75);
  assert.equal(multiplier(100), 2);
});

test('headline picks the higher role', () => {
  assert.equal(headlineRole(75, 0), 'survivor');
  assert.equal(headlineRole(0, 50), 'killer');
  assert.equal(headlineRole(0, 0), null);
  assert.equal(headlinePercent(75, 0), 75);
  assert.equal(headlinePercent(0, 50), 50);
});

test('formatPercent always signed', () => {
  assert.equal(formatPercent(75), '+75%');
  assert.equal(formatPercent(0), '+0%');
});

test('formatMultiplier: two decimals, whole numbers collapse except x1.00', () => {
  assert.equal(formatMultiplier(0), '×1.00');
  assert.equal(formatMultiplier(75), '×1.75');
  assert.equal(formatMultiplier(50), '×1.50');
  assert.equal(formatMultiplier(100), '×2');
  assert.equal(formatMultiplier(200), '×3');
});

test('event bonus is additive: a x2 event contributes +100%', () => {
  assert.equal(eventBonusPercent(2), 100);
  assert.equal(eventBonusPercent(1.5), 50);
  assert.equal(eventBonusPercent(1), 0); // a x1 event is a no-op
  assert.equal(eventBonusPercent(0), 0);
});

test('total multiplier stacks base + queue + event (the in-game x2.25 case)', () => {
  // Base 1.00 + Survivor Queue Bonus 0.25 + Bloodhunt 1.00 = 2.25
  assert.equal(totalMultiplier(25, 2), 2.25);
  assert.equal(totalMultiplier(75, null), 1.75); // no event
  assert.equal(totalMultiplier(0, 2), 2); // event only
});

test('raw multiplier formatting', () => {
  assert.equal(formatMult(2), '×2');
  assert.equal(formatMult(1.5), '×1.5');
  assert.equal(formatMultFixed(2.25), '×2.25');
  assert.equal(formatMultFixed(1), '×1.00');
});

test('relativeTime buckets', () => {
  const now = Date.parse('2026-01-01T00:10:00.000Z');
  assert.equal(relativeTime(null, now), 'never');
  assert.equal(relativeTime('2026-01-01T00:09:58.000Z', now), 'just now');
  assert.equal(relativeTime('2026-01-01T00:09:30.000Z', now), '30s ago');
  assert.equal(relativeTime('2026-01-01T00:05:00.000Z', now), '5m ago');
  assert.equal(relativeTime('2025-12-31T22:10:00.000Z', now), '2h ago');
});
