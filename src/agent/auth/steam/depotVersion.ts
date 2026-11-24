import { createHash } from 'node:crypto';
import { isSteamShippingVersion } from '../../version/category.js';

export interface DepotFile {
  filename?: string;
  sha_filename?: string;
  size?: string | number;
  flags?: number;
}

const DEPOT_DIRECTORY_FLAG = 64;
const MAX_CANDIDATES = 16;
const versionFilename = 'deadbydaylightversionnumber.txt';
// Steam hashes the lowercased depot-relative path with Windows separators.
const versionPathHash = createHash('sha1')
  .update('deadbydaylight\\content\\version\\' + versionFilename)
  .digest('hex');

export async function readDepotVersion(
  files: DepotFile[],
  download: (entry: DepotFile) => Promise<string>,
  manifestId: string,
): Promise<string> {
  const candidates: DepotFile[] = [];
  for (const file of files) {
    if (((file.flags ?? 0) & DEPOT_DIRECTORY_FLAG) !== 0) continue;
    if (file.sha_filename === versionPathHash) return download(file);
    if (typeof file.filename !== 'string') continue;
    const path = file.filename.toLowerCase().replaceAll('\\', '/');
    const name = path.split('/').pop();
    if (name === versionFilename) return download(file);

    // A renamed marker is still a short, standalone build string. Only probe
    // small text files or files in the game's version directory.
    const size = Number(file.size);
    if (size > 0 && size <= 256 && (path.endsWith('.txt') || path.includes('/content/version/'))) {
      candidates.push(file);
    }
  }

  const names = candidates.slice(0, MAX_CANDIDATES).map(file => file.filename).join(', ') || 'none';
  if (candidates.length > MAX_CANDIDATES) {
    throw new Error(`Too many candidate version files in manifest ${manifestId} (${candidates.length}). First paths: ${names}`);
  }

  const versions = new Set<string>();
  for (const file of candidates) {
    const value = await download(file);
    if (isSteamShippingVersion(value)) versions.add(value);
  }
  if (versions.size === 1) return [...versions][0]!;

  throw new Error(
    `Could not identify the Steam version file in manifest ${manifestId} (${files.length} entries, ` +
    `${candidates.length} small candidates, ${versions.size} distinct build strings). Candidate paths: ${names}`,
  );
}
