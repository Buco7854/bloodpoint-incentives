import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { test } from 'node:test';
import { decryptDbdCdn } from './decrypt.js';

const MAGIC = 'DbdDAwAC';

/**
 * The exact inverse of decryptDbdCdn, so we can round-trip without a live CDN
 * fixture: zlib-compress UTF-16LE, prepend a small header, standard-base64, shift
 * every char -1 into "modified base64", 0x00-pad to a 16-byte multiple,
 * AES-256-ECB (no padding), prepend a 12-byte header, base64, prepend the magic.
 */
function encryptForTest(jsonText: string, keyB64: string): string {
  const key = Buffer.from(keyB64, 'base64');
  const zstream = zlib.deflateSync(Buffer.from(jsonText, 'utf16le'));
  const inner = Buffer.concat([Buffer.from([0x01, 0x02, 0x03, 0x04]), zstream]);
  const std = inner.toString('base64');
  const mod = Buffer.from([...std].map((c) => c.charCodeAt(0) - 1));
  const padLen = (16 - (mod.length % 16)) % 16;
  const plain = Buffer.concat([mod, Buffer.alloc(padLen, 0)]);
  const cipher = crypto.createCipheriv('aes-256-ecb', key, null);
  cipher.setAutoPadding(false);
  const ct = Buffer.concat([cipher.update(plain), cipher.final()]);
  const payload = Buffer.concat([Buffer.alloc(12, 0xab), ct]);
  return MAGIC + payload.toString('base64');
}

test('decryptDbdCdn round-trips an encrypted CDN payload', () => {
  const key = crypto.randomBytes(32).toString('base64');
  const json = JSON.stringify({
    bonusPointEvents: [
      {
        startTime: '2026-07-03T15:00:00',
        endTime: '2026-07-07T14:59:00',
        eventTitle: 'BPEVENT_Bloodhunt_NAME',
        eventType: 0,
        multiplier: 2,
      },
    ],
  });
  const raw = encryptForTest(json, key);
  assert.equal(decryptDbdCdn(raw, key), json);
});

test('decryptDbdCdn rejects a wrong-size key', () => {
  const shortKey = crypto.randomBytes(16).toString('base64');
  assert.throws(() => decryptDbdCdn('DbdDAwACAAAA', shortKey), /32-byte AES key/);
});
