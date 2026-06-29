import { useCallback, useEffect, useState } from 'react';
import { type BodyPlatform, DEFAULT_PLATFORM, isKnownPlatform } from '@shared/platforms';

/**
 * The client-side views. `home` and `region` are platform-scoped, mirroring the
 * REST API shape (`/platforms/{platform}/regions/{region}`).
 */
export type Route =
  | { name: 'home'; platform: BodyPlatform }
  | { name: 'register' }
  | { name: 'region'; platform: BodyPlatform; id: string }
  | { name: 'login' }
  | { name: 'setup' }
  | { name: 'admin' }
  | { name: 'account' }
  | { name: 'notfound' };

const PLATFORM_HOME = /^\/platforms\/([^/]+)$/;
const PLATFORM_REGION = /^\/platforms\/([^/]+)\/regions\/([^/]+)$/;

function normalize(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

function toRoute(pathname: string): Route {
  const path = normalize(pathname);
  if (path === '/') return { name: 'home', platform: DEFAULT_PLATFORM };
  if (path === '/register') return { name: 'register' };
  if (path === '/login') return { name: 'login' };
  if (path === '/setup') return { name: 'setup' };
  if (path === '/admin') return { name: 'admin' };
  if (path === '/account') return { name: 'account' };
  const region = PLATFORM_REGION.exec(path);
  if (region) {
    const platform = region[1];
    const id = region[2];
    if (platform && id && isKnownPlatform(platform))
      return { name: 'region', platform, id: decodeURIComponent(id) };
  }
  const home = PLATFORM_HOME.exec(path);
  if (home) {
    const platform = home[1];
    if (platform && isKnownPlatform(platform)) return { name: 'home', platform };
  }
  return { name: 'notfound' };
}

function toPath(route: Route): string {
  if (route.name === 'register') return '/register';
  if (route.name === 'login') return '/login';
  if (route.name === 'setup') return '/setup';
  if (route.name === 'admin') return '/admin';
  if (route.name === 'account') return '/account';
  if (route.name === 'region')
    return `/platforms/${route.platform}/regions/${encodeURIComponent(route.id)}`;
  if (route.name === 'home') return `/platforms/${route.platform}`;
  return '/';
}

/**
 * Minimal client-side routing via the History API (no router dependency). The hub
 * serves the SPA shell for any non-API path, so real URLs work and are shareable.
 */
export function useRoute(): readonly [Route, (to: Route) => void] {
  const [route, setRoute] = useState<Route>(() => toRoute(window.location.pathname));

  useEffect(() => {
    const onPop = (): void => setRoute(toRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Canonicalize the bare root to the default platform's home, mirroring the
  // server-side redirect (this is what runs in dev, where the SPA is served at "/").
  useEffect(() => {
    if (normalize(window.location.pathname) === '/') {
      window.history.replaceState(null, '', toPath(route));
    }
  }, [route]);

  const navigate = useCallback((to: Route): void => {
    const path = toPath(to);
    if (normalize(window.location.pathname) !== path) {
      window.history.pushState(null, '', path);
      window.scrollTo(0, 0);
    }
    setRoute(to);
  }, []);

  return [route, navigate] as const;
}
