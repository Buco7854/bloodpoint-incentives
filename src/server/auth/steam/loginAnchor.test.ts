import assert from 'node:assert/strict';
import { test } from 'node:test';
import { compareSemver, parseLiveKeys, selectAnchor } from './loginAnchor.js';

test('compareSemver orders by numeric segments', () => {
  assert.ok(compareSemver('9.3.0', '9.2.9') > 0);
  assert.ok(compareSemver('9.3.0', '10.0.0') < 0);
  assert.equal(compareSemver('9.3.0', '9.3.0'), 0);
});

test('selectAnchor picks the highest pattern present in both maps', () => {
  const anchor = selectAnchor({
    availableVersions: { '9.2.0': 'c920', '9.3.0': 'c930', '9.4.0': 'c940' },
    liveKeys: { '9.2.0': 'k920', '9.3.0': 'k930' },
  });
  assert.equal(anchor.pattern, '9.3.0');
  assert.equal(anchor.contentVersionId, 'c930');
  assert.equal(anchor.secretKey, 'k930');
});

test('selectAnchor picks the highest build id from a list', () => {
  const anchor = selectAnchor({
    availableVersions: { '9.3.0': ['100', '350', '210'] },
    liveKeys: { '9.3.0': 'k930' },
  });
  assert.equal(anchor.contentVersionId, '350');
});

test('selectAnchor throws when there is no common pattern', () => {
  assert.throws(() =>
    selectAnchor({ availableVersions: { '9.3.0': 'c' }, liveKeys: { '9.4.0': 'k' } }),
  );
});

test('parseLiveKeys keeps only *_live and strips the suffix (JSON)', () => {
  const keys = parseLiveKeys(
    JSON.stringify({ '9.3.0_live': 'abc', '9.3.0_ptb': 'xyz', '9.2.0_live': 'def' }),
  );
  assert.deepEqual(keys, { '9.3.0': 'abc', '9.2.0': 'def' });
});

test('parseLiveKeys falls back to line parsing', () => {
  const body = '"9.3.0_live": "abc"\n"9.3.0_qa": "nope"\n"9.4.0_live": "ghi"';
  assert.deepEqual(parseLiveKeys(body), { '9.3.0': 'abc', '9.4.0': 'ghi' });
});
