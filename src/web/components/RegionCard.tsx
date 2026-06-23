import clsx from 'clsx';
import { formatMultiplier, formatPercent, relativeTime } from '@shared/format';
import type { RegionIncentive } from '@shared/types';
import { type BonusTier, regionView } from '../lib/bonus';
import { Badge } from './Badge';
import { BalanceBar } from './BalanceBar';
import { BloodpointIcon } from './BloodpointIcon';
import { RoleStat } from './RoleStat';
import { SkullIcon, SurvivorIcon } from './icons';

const CARD_THEME = {
  killer: 'from-blood-900/55 via-void-700 to-void-800 border-blood-800/50',
  survivor: 'from-survivor/10 via-void-700 to-void-800 border-survivor/25',
  none: 'from-void-600/40 via-void-700 to-void-800 border-white/10',
} as const;

const GLOW: Record<BonusTier, string> = {
  none: '',
  low: '',
  mid: 'shadow-card',
  high: 'shadow-glow-soft',
  max: 'shadow-glow',
};

const HEADLINE_COLOR = {
  killer: 'text-blood-400',
  survivor: 'text-survivor',
  none: 'text-bone-300',
} as const;

interface Props {
  region: RegionIncentive;
  now: number;
}

export function RegionCard({ region, now }: Props) {
  const { activeRole, headline, tier } = regionView(region);
  const themeKey = activeRole ?? 'none';
  const HeadlineIcon = activeRole === 'killer' ? SkullIcon : SurvivorIcon;
  const neverReal = !region.isReal && region.lastUpdated === null;

  return (
    <article
      className={clsx(
        'group relative flex animate-fade-up flex-col gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-5',
        CARD_THEME[themeKey],
        GLOW[tier],
      )}
    >
      {/* Faint role emblem watermark. */}
      <HeadlineIcon className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 text-white/[0.03]" />

      <header className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl leading-none" aria-hidden="true">
            {region.flag}
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-wide text-bone-100">
              {region.displayName}
            </h3>
            <p className="font-mono text-[11px] text-bone-500">{region.region}</p>
          </div>
        </div>
        {region.stale && !neverReal && <Badge tone="amber">Stale</Badge>}
        {neverReal && <Badge tone="neutral">No data</Badge>}
      </header>

      <div className="relative">
        {activeRole ? (
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-1.5 pb-1">
              <HeadlineIcon className={clsx('h-6 w-6', HEADLINE_COLOR[themeKey])} />
              <BloodpointIcon className="h-7 w-7" />
            </div>
            <div className="leading-none">
              <div className={clsx('font-display text-5xl font-bold tabular', HEADLINE_COLOR[themeKey])}>
                {formatPercent(headline)}
              </div>
              <div className="mt-1.5 text-sm text-bone-400">
                {formatMultiplier(headline)} for {activeRole}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-1">
            <BloodpointIcon className="h-7 w-7 opacity-50" />
            <div>
              <div className="font-display text-2xl text-bone-200">No bonus</div>
              <div className="text-sm text-bone-500">×1.00 both roles</div>
            </div>
          </div>
        )}
      </div>

      <div className="relative grid gap-2">
        <RoleStat role="survivor" percent={region.survivor} emphasized={activeRole === 'survivor'} />
        <RoleStat role="killer" percent={region.killer} emphasized={activeRole === 'killer'} />
      </div>

      {region.isReal && <BalanceBar ratio={region.ratio} />}

      <footer className="relative mt-auto flex items-center justify-between pt-1 text-[11px] text-bone-500">
        <span>updated {relativeTime(region.lastUpdated, now)}</span>
        {region.isReal && <span className="tabular">ratio {region.ratio.toFixed(2)}</span>}
      </footer>
    </article>
  );
}
