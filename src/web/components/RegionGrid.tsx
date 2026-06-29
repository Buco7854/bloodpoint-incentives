import type { BodyPlatform } from '@shared/platforms';
import type { RegionIncentive } from '@shared/types';
import { RegionCard } from './RegionCard';

interface Props {
  regions: RegionIncentive[];
  platform: BodyPlatform;
  now: number;
  /** The visitor's most-likely region (lowest latency), highlighted if present. */
  userRegion?: string | null;
  /** Opens a region's history page. */
  onOpen?: (regionId: string) => void;
}

export function RegionGrid({ regions, platform, now, userRegion, onOpen }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {regions.map((region) => (
        <RegionCard
          key={region.region}
          region={region}
          platform={platform}
          now={now}
          isUserRegion={region.region === userRegion}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
