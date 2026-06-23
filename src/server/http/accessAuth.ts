import { timingSafeEqual } from 'node:crypto';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { AppConfig } from '../config.js';
import type { Logger } from '../logger.js';

function pathOf(url: string): string {
  const q = url.indexOf('?');
  return q === -1 ? url : url.slice(0, q);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function providedKey(req: FastifyRequest, headerName: string): string | null {
  const direct = req.headers[headerName];
  if (typeof direct === 'string' && direct.length > 0) return direct;
  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

/**
 * Optional site-access gate intended to sit behind Authentik. When ACCESS_API_KEY
 * is set, every route except /healthz requires the matching header (or a Bearer
 * token). When unset, the app is open and an upstream proxy is assumed to handle
 * auth.
 */
export function registerAccessAuth(app: FastifyInstance, config: AppConfig, log: Logger): void {
  if (!config.accessApiKey) {
    log.warn('ACCESS_API_KEY is not set; all routes are open (rely on an upstream proxy for auth)');
    return;
  }
  const expected = config.accessApiKey;

  app.addHook('onRequest', async (req, reply) => {
    if (pathOf(req.url) === '/healthz') return;
    const key = providedKey(req, config.accessApiKeyHeader);
    if (!key || !safeEqual(key, expected)) {
      await reply.code(401).send({ error: 'unauthorized' });
    }
  });
}
