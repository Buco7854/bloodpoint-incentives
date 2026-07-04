import type { Logger } from '../../common/logger.js';
import type { BonusEvent } from '../../shared/types.js';
import { decryptDbdCdn } from './decrypt.js';

const CDN_BASE = 'https://cdn.live.bhvrdbd.com';

/** BHVR localization keys we know friendly labels for; others fall back below. */
const TITLE_LABELS: Record<string, string> = {
  BPEVENT_Bloodhunt_NAME: 'Bloodhunt',
  BPEVENT_Bloodrush_NAME: 'Bloodrush',
  BPEVENT_Bloodfeast_NAME: 'Bloodfeast',
};

/** Resolve a display label from a `BPEVENT_<Name>_NAME` localization key. */
export function labelForEvent(key: string): string {
  if (TITLE_LABELS[key]) return TITLE_LABELS[key] as string;
  const m = key.match(/^BPEVENT_(.+?)_NAME$/);
  return m?.[1] ?? key;
}

interface RawEvent {
  startTime?: string;
  endTime?: string;
  eventTitle?: string;
  eventType?: number;
  multiplier?: number;
}

/** BHVR times are UTC with no suffix; append Z, then normalize to an ISO string. */
function toIsoUtc(s: string): string {
  const withZone = /([zZ])|([+-]\d\d:?\d\d)$/.test(s) ? s : `${s}Z`;
  const d = new Date(withZone);
  if (Number.isNaN(d.getTime())) throw new Error(`unparseable event time "${s}"`);
  return d.toISOString();
}

/** Parse the decrypted bonusPointEventsContent JSON into normalized events. */
export function parseBonusEvents(jsonText: string): BonusEvent[] {
  const data = JSON.parse(jsonText) as { bonusPointEvents?: RawEvent[] };
  const list = Array.isArray(data.bonusPointEvents) ? data.bonusPointEvents : [];
  const out: BonusEvent[] = [];
  for (const e of list) {
    if (typeof e.startTime !== 'string' || typeof e.endTime !== 'string') continue;
    if (typeof e.multiplier !== 'number' || !Number.isFinite(e.multiplier)) continue;
    const key = typeof e.eventTitle === 'string' ? e.eventTitle : '';
    let startsAt: string;
    let endsAt: string;
    try {
      startsAt = toIsoUtc(e.startTime);
      endsAt = toIsoUtc(e.endTime);
    } catch {
      continue;
    }
    out.push({ key, label: labelForEvent(key), multiplier: e.multiplier, startsAt, endsAt });
  }
  return out;
}

export interface ContentDeps {
  /** BHVR API host, e.g. steam.live.bhvrdbd.com (same as matchIncentives). */
  host: string;
  krakenProvider: 'steam' | 'egs';
  clientOs: string;
  log: Logger;
  requestTimeoutMs?: number;
}

async function timedFetch(url: string, init: RequestInit, timeoutMs: number, parent?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onParentAbort = (): void => controller.abort();
  parent?.addEventListener('abort', onParentAbort, { once: true });
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    parent?.removeEventListener('abort', onParentAbort);
  }
}

/** GET /api/v1/config and pull CDN_ROOT_FOLDER_PATH (needs the session api-key). */
export async function resolveCdnRoot(
  deps: ContentDeps,
  apiKey: string,
  versionPattern: string,
  userAgent: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await timedFetch(
    `https://${deps.host}/api/v1/config`,
    {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        'x-kraken-client-platform': deps.krakenProvider,
        'x-kraken-client-provider': deps.krakenProvider,
        'x-kraken-client-version': versionPattern,
        'x-kraken-client-os': deps.clientOs,
        'x-kraken-analytics-dynamic-contents': '[""]',
        'api-key': apiKey,
        'User-Agent': userAgent,
      },
    },
    deps.requestTimeoutMs ?? 15_000,
    signal,
  );
  if (!res.ok) throw new Error(`config HTTP ${res.status}`);
  const cfg = (await res.json()) as Array<{ value?: string; keyName?: string }>;
  const entry = Array.isArray(cfg) ? cfg.find((e) => e && e.keyName === 'CDN_ROOT_FOLDER_PATH') : undefined;
  if (!entry?.value) throw new Error('CDN_ROOT_FOLDER_PATH not present in config');
  return entry.value;
}

/** Download + decrypt the bonus-point events schedule from the public CDN. */
export async function fetchBonusPointEvents(
  deps: ContentDeps,
  cdnRoot: string,
  gameVersion: string,
  aesKeyB64: string,
  userAgent: string,
  signal?: AbortSignal,
): Promise<BonusEvent[]> {
  const url = `${CDN_BASE}/clientData/${cdnRoot}/content/${gameVersion}/bonusPointEventsContent.json`;
  const res = await timedFetch(
    url,
    { headers: { 'User-Agent': userAgent, 'Content-Type': 'application/json; charset=utf-8' } },
    deps.requestTimeoutMs ?? 15_000,
    signal,
  );
  if (!res.ok) throw new Error(`CDN HTTP ${res.status}`);
  const raw = await res.text();
  const jsonText = decryptDbdCdn(raw, aesKeyB64);
  return parseBonusEvents(jsonText);
}
