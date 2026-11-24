import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import SteamUser from 'steam-user';

test('Steam decodes the entire encrypted version chunk on the agent runtime', async () => {
  const version = Buffer.from('DBD_Sushi_REL_Steam_Shipping_9_3420587\n');
  const sha = createHash('sha1').update(version).digest('hex');
  // Synthetic Steam VSZa frame encrypted with a zero key and IV. Its footer
  // crosses an AES block boundary and requires the decipher's final bytes.
  const encrypted = Buffer.from(
    'dc95c078a2408989ad48a21492842087f208754d582f68a101fbd74b8f46b264' +
    'fce929702df858a95390b886750c543a80cbba48324eae367cb51d1f6d390066' +
    '6e1c209c3fc8439379dd9f4cd3a564d06ff80f54ec3d1e72d1d23b6b78b8a4df',
    'hex',
  );
  const server = createServer((_req, res) => res.end(encrypted));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const { port } = server.address() as AddressInfo;
    const session = { getDepotDecryptionKey: async () => ({ key: Buffer.alloc(32) }) };
    const { chunk } = await SteamUser.prototype.downloadChunk.call(session, 381210, 381211, sha, {
      Host: `127.0.0.1:${port}`,
    });
    assert.deepEqual(chunk, version);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
