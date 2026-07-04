import assert from 'node:assert/strict';
import { test } from 'node:test';
import { labelForEvent, parseBonusEvents } from './content.js';

test('labelForEvent maps known keys and derives unknown ones', () => {
  assert.equal(labelForEvent('BPEVENT_Bloodhunt_NAME'), 'Bloodhunt');
  assert.equal(labelForEvent('BPEVENT_Bloodrush_NAME'), 'Bloodrush');
  assert.equal(labelForEvent('BPEVENT_SomethingNew_NAME'), 'SomethingNew');
  assert.equal(labelForEvent('weird'), 'weird');
});

test('parseBonusEvents normalizes times to UTC ISO and drops junk', () => {
  const json = JSON.stringify({
    bonusPointEvents: [
      { startTime: '2026-07-03T15:00:00', endTime: '2026-07-07T14:59:00', eventTitle: 'BPEVENT_Bloodhunt_NAME', multiplier: 2 },
      { startTime: 'not-a-date', endTime: 'x', eventTitle: 'BPEVENT_Bad_NAME', multiplier: 2 }, // dropped
      { startTime: '2025-01-01T00:00:00', endTime: '2025-01-02T00:00:00', eventTitle: 'BPEVENT_X_NAME' }, // no multiplier -> dropped
    ],
  });
  const events = parseBonusEvents(json);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], {
    key: 'BPEVENT_Bloodhunt_NAME',
    label: 'Bloodhunt',
    multiplier: 2,
    startsAt: '2026-07-03T15:00:00.000Z',
    endsAt: '2026-07-07T14:59:00.000Z',
  });
});

test('parseBonusEvents tolerates a missing array', () => {
  assert.deepEqual(parseBonusEvents('{}'), []);
});
