import { type AppConfig, ConfigError } from '../config.js';
import type { Logger } from '../logger.js';
import { VersionResolver } from '../version/resolver.js';
import type { StateStore } from '../version/store.js';
import { ApiKeyProvider } from './apiKeyProvider.js';
import { EpicAuthProvider } from './epicProvider.js';
import { SteamAuthProvider } from './steamProvider.js';
import { SteamClient } from './steam/steamClient.js';
import { SteamVersionDiscovery } from './steam/versionDiscovery.js';
import type { AuthProvider, VersionDiscovery } from './types.js';

export interface AuthBundle {
  provider: AuthProvider;
  resolver: VersionResolver;
}

/** Wires the auth provider and version resolver for the configured mode. */
export function createAuth(config: AppConfig, store: StateStore, log: Logger): AuthBundle {
  const versionLog = log.child({ component: 'version' });

  const buildResolver = (discovery: VersionDiscovery | null): VersionResolver =>
    new VersionResolver({
      gameVersion: config.gameVersion,
      clientOs: config.clientOs,
      discovery,
      store,
      log: versionLog,
    });

  // Quick mode: a pre-obtained key wins and disables depot discovery.
  if (config.dbdApiKey) {
    return { provider: new ApiKeyProvider(config.dbdApiKey), resolver: buildResolver(null) };
  }

  if (config.authProvider === 'epic') {
    return { provider: new EpicAuthProvider(), resolver: buildResolver(null) };
  }

  // Full Steam mode.
  const { username, password, sharedSecret } = config.steam;
  if (!username || !password) {
    throw new ConfigError('Steam mode requires STEAM_USERNAME and STEAM_PASSWORD');
  }
  const steamClient = new SteamClient(
    { username, password, sharedSecret },
    log.child({ component: 'steam' }),
  );
  const discovery = new SteamVersionDiscovery(steamClient, versionLog);
  const provider = new SteamAuthProvider({
    steamClient,
    discovery,
    config,
    log: log.child({ component: 'auth' }),
  });
  return { provider, resolver: buildResolver(provider.versionDiscovery) };
}
