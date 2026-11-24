import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readDepotVersion } from './depotVersion.js';

const build = 'DBD_Sushi_REL_Steam_Shipping_9_3420587';

test('downloads the known filename first, including from a relocated Windows path', async () => {
  const marker = { filename: 'Moved\\DeadByDaylightVersionNumber.TXT', size: '40' };
  const result = await readDepotVersion([{ filename: 'old.txt', size: 32 }, marker], async file => {
    assert.equal(file, marker);
    return build;
  }, '123');
  assert.equal(result, build);
});

test('recognizes a renamed Steam build marker and skips unrelated depot content', async () => {
  const files = [
    { filename: 'large.txt', size: '2000000' },
    { filename: 'dir.txt', size: '1', flags: 64 },
    { filename: 'notes.txt', size: '12' },
    { filename: 'DeadByDaylight\\Content\\Version\\current', size: '40' },
  ];
  const downloads: unknown[] = [];
  const result = await readDepotVersion(files, async file => {
    downloads.push(file);
    return file === files[3] ? build : '10.3.0';
  }, '123');
  assert.equal(result, build);
  assert.deepEqual(downloads, files.slice(2));
});

test('reports the manifest and candidate paths when there is no unique build', async () => {
  const files = [{ filename: 'a.txt', size: 40 }, { filename: 'b.txt', size: 40 }];
  for (const values of [['10.3.0', ''], [build, build + '1']]) {
    await assert.rejects(readDepotVersion(files, async () => values.shift()!, '123'),
      /manifest 123.*Candidate paths: a.txt, b.txt/);
  }
});

test('resolves the canonical file by Steam path hash when the display name is unavailable', async () => {
  const marker = { sha_filename: '78ba889da0812aa81cb8faab2c6f19d1be855656', size: '39' };
  const result = await readDepotVersion([{ filename: 'dummy.txt', size: '1' }, marker], async file => {
    assert.equal(file, marker);
    return build;
  }, '2916303859126383048');
  assert.equal(result, build);
});
