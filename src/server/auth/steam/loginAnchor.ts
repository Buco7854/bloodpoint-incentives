/**
 * Selects the version "anchor" used to build the headers for the BHVR Steam
 * login call: the highest semver version pattern present in BOTH the server's
 * availableVersions and the live-keys map, plus that pattern's content id and
 * secret key. Pure so it can be unit tested without any network.
 */
export interface AnchorInput {
  /** pattern -> contentVersionId (or a list of build ids to pick the highest of). */
  availableVersions: Record<string, string | string[]>;
  /** pattern -> secret key (already filtered to *_live and stripped of the suffix). */
  liveKeys: Record<string, string>;
}

export interface Anchor {
  pattern: string;
  contentVersionId: string;
  secretKey: string;
}

export function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function highestContentId(raw: string | string[]): string {
  if (!Array.isArray(raw)) return raw;
  if (raw.length === 0) return '';
  return [...raw].sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return a < b ? -1 : a > b ? 1 : 0;
  })[raw.length - 1] as string;
}

export function selectAnchor(input: AnchorInput): Anchor {
  const common = Object.keys(input.liveKeys).filter((p) => p in input.availableVersions);
  if (common.length === 0) {
    throw new Error('no version pattern is present in both availableVersions and the live-keys map');
  }
  const pattern = common.sort((a, b) => compareSemver(b, a))[0] as string;
  return {
    pattern,
    contentVersionId: highestContentId(input.availableVersions[pattern] ?? ''),
    secretKey: input.liveKeys[pattern] as string,
  };
}

/** Parse keyapi.deadbyqueue.com/keys into pattern -> key, keeping only *_live. */
export function parseLiveKeys(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  let entries: [string, unknown][] = [];
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    entries = Object.entries(parsed);
  } catch {
    // Fall back to line parsing: "version_branch": "key"
    for (const line of body.split('\n')) {
      const match = line.match(/"([^"]+)"\s*:\s*"([^"]+)"/);
      if (match?.[1] && match[2]) entries.push([match[1], match[2]]);
    }
  }
  for (const [key, value] of entries) {
    if (typeof value !== 'string') continue;
    if (!key.endsWith('_live')) continue;
    out[key.slice(0, -'_live'.length)] = value;
  }
  return out;
}
