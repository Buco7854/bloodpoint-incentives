import clsx from 'clsx';
import { formatMultiplier, formatPercent, relativeTime } from '@shared/format';
import type { RegionIncentive, Role } from '@shared/types';
import { regionView } from '../lib/bonus';
import { Badge } from './Badge';
import { BalanceBar } from './BalanceBar';
import { BloodpointIcon } from './BloodpointIcon';
import { SkullIcon, SurvivorIcon } from './icons';

const ROLE_META = {
  survivor: { label: 'Survivor', Icon: SurvivorIcon, accent: 'text-survivor', border: 'border-survivor/40 bg-survivor/10', tone: 'survivor' },
  killer: { label: 'Killer', Icon: SkullIcon, accent: 'text-blood-400', border: 'border-blood-500/40 bg-blood-600/10', tone: 'blood' },
} as const;

const HERO_THEME = {
  killer: 'from-blood-900/60 via-void-700 to-void-800 border-blood-800/50',
  survivor: 'from-survivor/12 via-void-700 to-void-800 border-survivor/25',
  none: 'from-void-600/40 via-void-700 to-void-800 border-white/10',
} as const;

const HEADLINE_COLOR = {
  killer: 'text-blood-400',
  survivor: 'text-survivor',
  none: 'text-bone-300',
} as const;

function RolePanel({ role, percent, emphasized }: { role: Role; percent: number; emphasized: boolean }) {
  const { label, Icon, accent, border, tone } = ROLE_META[role];
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl border p-5',
        emphasized ? border : 'border-white/10 bg-white/[0.02]',
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={clsx('h-6 w-6', emphasized ? accent : 'text-bone-500')} />
        <span
          className={clsx(
            'font-display text-lg tracking-wide',
            emphasized ? 'text-bone-100' : 'text-bone-400',
          )}
        >
          {label}
        </span>
        {emphasized && (
          <Badge tone={tone} className="ml-auto">
            Bonus
          </Badge>
        )}
      </div>
      <div className="flex items-end gap-3">
        <span className={clsx('font-display text-5xl font-bold tabular', emphasized ? accent : 'text-bone-300')}>
          {formatPercent(percent)}
        </span>
        <span className="mb-1.5 flex items-center gap-1.5 text-bone-400">
          <BloodpointIcon className="h-5 w-5" />
          {formatMultiplier(percent)}
        </span>
      </div>
    </div>
  );
}

interface Props {
  region: RegionIncentive;
  now: number;
}

export function SingleServerHero({ region, now }: Props) {
  const { activeRole, headline } = regionView(region);
  const themeKey = activeRole ?? 'none';
  const HeadlineIcon = activeRole === 'killer' ? SkullIcon : SurvivorIcon;
  const neverReal = !region.isReal && region.lastUpdated === null;

  return (
    <section
      className={clsx(
        'relative mx-auto max-w-3xl animate-fade-up overflow-hidden rounded-3xl border bg-gradient-to-br p-6 sm:p-8',
        HERO_THEME[themeKey],
      )}
    >
      <HeadlineIcon className="pointer-events-none absolute -right-10 -top-8 h-64 w-64 text-white/[0.025]" />

      <header className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden="true">
            {region.flag}
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-bone-100 sm:text-3xl">
              {region.displayName}
            </h2>
            <p className="font-mono text-xs text-bone-500">{region.region}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {region.stale && !neverReal && <Badge tone="amber">Stale</Badge>}
          {neverReal && <Badge tone="neutral">No data yet</Badge>}
        </div>
      </header>

      <div className="relative my-7 flex items-center justify-center gap-4 text-center">
        {activeRole ? (
          <>
            <div className="flex items-center gap-2">
              <HeadlineIcon className={clsx('h-10 w-10', HEADLINE_COLOR[themeKey])} />
              <BloodpointIcon className="h-12 w-12" />
            </div>
            <div className="text-left leading-none">
              <div className={clsx('font-display text-7xl font-bold tabular', HEADLINE_COLOR[themeKey])}>
                {formatPercent(headline)}
              </div>
              <div className="mt-2 text-bone-400">
                {formatMultiplier(headline)} bonus for {activeRole}s
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <BloodpointIcon className="h-12 w-12 opacity-50" />
            <div className="text-left">
              <div className="font-display text-4xl text-bone-200">No bonus</div>
              <div className="text-bone-500">×1.00 for both roles right now</div>
            </div>
          </div>
        )}
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <RolePanel role="survivor" percent={region.survivor} emphasized={activeRole === 'survivor'} />
        <RolePanel role="killer" percent={region.killer} emphasized={activeRole === 'killer'} />
      </div>

      {region.isReal && (
        <div className="relative mt-6">
          <BalanceBar ratio={region.ratio} />
        </div>
      )}

      <footer className="relative mt-6 flex items-center justify-between text-xs text-bone-500">
        <span>updated {relativeTime(region.lastUpdated, now)}</span>
        <span>auto-refreshing</span>
      </footer>
    </section>
  );
}
