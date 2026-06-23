import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { loadConfig } from './config.js';

const steamEnv = (over: Record<string, string>): NodeJS.ProcessEnv =>
  ({
    AUTH_PROVIDER: 'steam',
    STEAM_USERNAME: 'user',
    DBD_GAME_VERSION: 'auto',
    ...over,
  }) as NodeJS.ProcessEnv;

test('strips surrounding double quotes but keeps inner special chars', () => {
  const c = loadConfig(steamEnv({ STEAM_PASSWORD: '"p@ss$w0rd!"' }));
  assert.equal(c.steam.password, 'p@ss$w0rd!');
});

test('strips single quotes and preserves inner spaces', () => {
  const c = loadConfig(steamEnv({ STEAM_PASSWORD: "'  spaced pw  '" }));
  assert.equal(c.steam.password, '  spaced pw  ');
});

test('unquoted values are trimmed', () => {
  const c = loadConfig(steamEnv({ STEAM_PASSWORD: '  plainpw  ' }));
  assert.equal(c.steam.password, 'plainpw');
});

test('<NAME>_FILE reads the secret raw from disk', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'dbd-secret-'));
  const file = path.join(dir, 'pw');
  writeFileSync(file, 'p@ss$w0rd-with-$pecials\n');
  const c = loadConfig(steamEnv({ STEAM_PASSWORD_FILE: file }));
  assert.equal(c.steam.password, 'p@ss$w0rd-with-$pecials');
});
