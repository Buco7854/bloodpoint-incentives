/** Static metadata for the 15 matchmaking regions BHVR exposes. */
export interface RegionMeta {
  region: string;
  displayName: string;
  flag: string;
}

/** Canonical region list (BHVR's region ids + our display labels/flags). */
export const REGIONS: readonly RegionMeta[] = [
  { region: 'eu-west-1', displayName: 'EU West (Ireland)', flag: '🇮🇪' },
  { region: 'eu-west-2', displayName: 'EU West (London)', flag: '🇬🇧' },
  { region: 'eu-central-1', displayName: 'EU Central (Frankfurt)', flag: '🇩🇪' },
  { region: 'us-east-1', displayName: 'US East (N. Virginia)', flag: '🇺🇸' },
  { region: 'us-east-2', displayName: 'US East (Ohio)', flag: '🇺🇸' },
  { region: 'us-west-1', displayName: 'US West (N. California)', flag: '🇺🇸' },
  { region: 'us-west-2', displayName: 'US West (Oregon)', flag: '🇺🇸' },
  { region: 'ca-central-1', displayName: 'Canada (Montreal)', flag: '🇨🇦' },
  { region: 'sa-east-1', displayName: 'South America (São Paulo)', flag: '🇧🇷' },
  { region: 'ap-southeast-1', displayName: 'SE Asia (Singapore)', flag: '🇸🇬' },
  { region: 'ap-southeast-2', displayName: 'Oceania (Sydney)', flag: '🇦🇺' },
  { region: 'ap-northeast-1', displayName: 'Asia (Tokyo)', flag: '🇯🇵' },
  { region: 'ap-northeast-2', displayName: 'Asia (Seoul)', flag: '🇰🇷' },
  { region: 'ap-east-1', displayName: 'Asia (Hong Kong)', flag: '🇭🇰' },
  { region: 'ap-south-1', displayName: 'Asia (Mumbai)', flag: '🇮🇳' },
];

const REGION_INDEX = new Map<string, RegionMeta>(REGIONS.map((r) => [r.region, r]));

export function getRegionMeta(region: string): RegionMeta | undefined {
  return REGION_INDEX.get(region);
}

export function isKnownRegion(region: string): boolean {
  return REGION_INDEX.has(region);
}

export const ALL_REGION_IDS: readonly string[] = REGIONS.map((r) => r.region);
