import crypto from 'node:crypto';
import zlib from 'node:zlib';

/**
 * Decrypts a Dead by Daylight CDN content file (e.g. bonusPointEventsContent.json)
 * to plaintext JSON, undoing its five obfuscation layers (see the inline steps).
 * The AES key is the per-version login-anchor secretKey, never hardcoded.
 */
const MAGIC = 'DbdDAwAC';

export function decryptDbdCdn(raw: string, aesKeyB64: string): string {
  // Keys may be base64url (contain - or _); normalize to standard base64.
  const key = Buffer.from(aesKeyB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (key.length !== 32) throw new Error(`expected a 32-byte AES key, got ${key.length}`);

  const trimmed = raw.trim();
  const body = trimmed.startsWith(MAGIC) ? trimmed.slice(MAGIC.length) : trimmed;
  const payload = Buffer.from(body, 'base64');

  // Layer 3: skip the 12-byte header, AES-256-ECB (no padding), 16-byte aligned.
  const ct = payload.subarray(12);
  const ecbLen = ct.length - (ct.length % 16);
  if (ecbLen <= 0) throw new Error('ciphertext too short after header');
  const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);
  decipher.setAutoPadding(false);
  const aesOut = Buffer.concat([decipher.update(ct.subarray(0, ecbLen)), decipher.final()]);

  // Layer 4: "modified base64" -> standard base64 (+1 per byte, drop 0x00 padding).
  let std = '';
  for (let i = 0; i < aesOut.length; i += 1) {
    const c = aesOut[i]!;
    if (c !== 0) std += String.fromCharCode(c + 1);
  }
  const inner = Buffer.from(std, 'base64');

  // Layer 5: locate the zlib magic (0x78 0x9C, or 0x78 0xDA), inflate, UTF-16LE.
  let z = inner.indexOf(Buffer.from([0x78, 0x9c]));
  if (z < 0) z = inner.indexOf(Buffer.from([0x78, 0xda]));
  if (z < 0) throw new Error('zlib stream not found in decrypted content');
  return zlib.inflateSync(inner.subarray(z)).toString('utf16le').replace(/^﻿/, '');
}
