import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FatalAuthError } from '../auth/errors.js';
import type { BhvrClient } from '../bhvr/client.js';
import { createLogger } from '../logger.js';
import type { VersionResolver } from '../version/resolver.js';
import { IncentiveCache } from './cache.js';
import { Poller } from './poller.js';

const log = createLogger('silent');
const version = { version: 'v', category: 'c', userAgent: 'ua', buildId: 1 };

const makeCache = (): IncentiveCache =>
  new IncentiveCache(
    { platform: 'Windows', provider: 'steam', forcedRegion: 'eu-central-1', refreshSeconds: 60, pageSize: 12 },
    ['eu-central-1'],
  );

const stubResolver = (): VersionResolver =>
  ({
    getActive: () => version,
    refreshFromDiscovery: async () => {},
    reportPassResult: () => {},
  }) as unknown as VersionResolver;

const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

test('poller calls onFatal and stops on a fatal auth error', async () => {
  const cache = makeCache();
  const client = {
    fetchRegion: async () => {
      throw new FatalAuthError('InvalidPassword');
    },
  } as unknown as BhvrClient;

  let captured: unknown = null;
  const poller = new Poller(
    cache,
    client,
    stubResolver(),
    {
      regionIds: ['eu-central-1'],
      pollIntervalMs: 600_000,
      versionRefreshMs: 3_600_000,
      onFatal: (err) => {
        captured = err;
      },
    },
    log,
  );

  poller.start();
  await wait(60);
  await poller.stop();

  assert.ok(captured instanceof FatalAuthError);
  assert.equal(cache.pollerStatus, 'error');
});

test('poller keeps running on a transient error', async () => {
  const cache = makeCache();
  let calls = 0;
  const client = {
    fetchRegion: async () => {
      calls += 1;
      throw new Error('network blip');
    },
  } as unknown as BhvrClient;

  let captured: unknown = null;
  const poller = new Poller(
    cache,
    client,
    stubResolver(),
    {
      regionIds: ['eu-central-1'],
      pollIntervalMs: 600_000,
      versionRefreshMs: 3_600_000,
      onFatal: (err) => {
        captured = err;
      },
    },
    log,
  );

  poller.start();
  await wait(60);
  await poller.stop();

  assert.equal(captured, null);
  assert.ok(calls >= 1);
});
