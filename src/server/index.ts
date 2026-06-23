import path from 'node:path';
import { ALL_REGION_IDS } from '../shared/regions.js';
import { createAuth } from './auth/factory.js';
import { BhvrClient } from './bhvr/client.js';
import { RateGate } from './bhvr/rateGate.js';
import { ConfigError, loadConfig } from './config.js';
import { buildServer } from './http/server.js';
import { createLogger } from './logger.js';
import { IncentiveCache } from './poll/cache.js';
import { Poller } from './poll/poller.js';
import { VersionFormatError } from './version/category.js';
import { StateStore } from './version/store.js';

async function main(): Promise<void> {
  const config = loadConfig();
  process.env.TZ = config.tz;

  const log = createLogger(config.logLevel);
  log.info(
    {
      provider: config.authProvider,
      platform: config.platform,
      forceRegion: config.forceRegion,
      pollIntervalSeconds: config.pollIntervalSeconds,
    },
    'starting dbd-bloodpoint-incentive',
  );

  const regionIds = config.forceRegion ? [config.forceRegion] : [...ALL_REGION_IDS];
  const store = new StateStore(config.stateDir, log.child({ component: 'store' }));
  const { provider, resolver } = createAuth(config, store, log);

  const cache = new IncentiveCache(
    {
      platform: config.platform,
      provider: config.authProvider,
      forcedRegion: config.forceRegion,
      refreshSeconds: config.uiRefreshSeconds,
      pageSize: config.pageSize,
    },
    regionIds,
  );

  try {
    await resolver.init();
  } catch (err) {
    if (err instanceof VersionFormatError) {
      log.fatal({ err }, 'invalid DBD_GAME_VERSION');
      throw err;
    }
    log.error({ err }, 'version resolution failed at startup; poller will keep retrying');
  }
  const active = resolver.getActive();
  if (active) cache.setVersionInfo(active.version, active.category);

  const rateGate = new RateGate(config.requestMinSpacingMs);
  const client = new BhvrClient(
    {
      host: config.bhvrHost,
      krakenProvider: config.krakenProvider,
      clientVersion: config.clientVersion,
      clientOs: config.clientOs,
      platform: config.platform,
    },
    provider,
    rateGate,
    log.child({ component: 'bhvr' }),
  );

  const poller = new Poller(
    cache,
    client,
    resolver,
    {
      regionIds,
      pollIntervalMs: config.pollIntervalSeconds * 1000,
      versionRefreshMs: config.versionRefreshHours * 3_600_000,
    },
    log.child({ component: 'poller' }),
  );

  const publicDir = path.join(__dirname, '../public');
  const app = await buildServer({ config, cache, publicDir, log: log.child({ component: 'http' }) });

  poller.start();
  await app.listen({ host: '0.0.0.0', port: config.port });
  log.info({ port: config.port }, 'http server listening');

  let shuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    log.info({ signal }, 'shutting down');
    try {
      await app.close();
      await poller.stop();
      await provider.shutdown();
    } catch (err) {
      log.error({ err }, 'error during shutdown');
    }
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

main().catch((err) => {
  if (err instanceof ConfigError) {
    console.error(`Configuration error: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
