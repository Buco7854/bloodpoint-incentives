import clsx from 'clsx';
import { formatMultiplier, formatPercent } from '@shared/format';
import { headlineRole } from '@shared/incentive';
import type { RegionIncentive, Role } from '@shared/types';
import { useI18n } from '../i18n';
import { formatUpdated } from '../i18n/time';
import { CARD_GRADIENT, ROLE_META } from '../lib/regionTheme';
import { Badge } from './Badge';
import { BalanceBar } from './BalanceBar';
import { BloodpointIcon } from './BloodpointIcon';
import { BonusHeadline } from './BonusHeadline';
import { RegionLabel } from './RegionLabel';

function RolePanel({ role, percent, emphasized }: { role: Role; percent: number; emphasized: boolean }) {
  const { t } = useI18n();
  const { labelKey, Icon, accent, emphasis, badge } = ROLE_META[role];
  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-2xl p-5 ring-1',
        emphasized ? emphasis : 'bg-white/[0.02] ring-white/10',
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={clsx('h-6 w-6', emphasized ? accent : 'text-bone-500')} />
        <span className={clsx('font-display text-lg tracking-wide', emphasized ? 'text-bone-100' : 'text-bone-400')}>
          {t(labelKey)}
        </span>
        {emphasized && (
          <Badge tone={badge} className="ml-auto">
            {t('bonusBadge')}
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
  const { t } = useI18n();
  const activeRole = headlineRole(region.survivor, region.killer);
  const themeKey = activeRole ?? 'none';
  const neverReal = !region.isReal && region.lastUpdated === null;

  return (
    <section
      className={clsx(
        'mx-auto max-w-3xl animate-fade-up overflow-hidden rounded-3xl border bg-gradient-to-br p-6 sm:p-8',
        CARD_GRADIENT[themeKey],
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <RegionLabel region={region} size="hero" />
        <div className="flex items-center gap-2">
          {region.stale && !neverReal && <Badge tone="amber">{t('badgeStale')}</Badge>}
          {neverReal && <Badge tone="neutral">{t('badgeNoDataYet')}</Badge>}
        </div>
      </header>

      <div className="my-7 flex justify-center">
        <BonusHeadline region={region} size="hero" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <RolePanel role="survivor" percent={region.survivor} emphasized={activeRole === 'survivor'} />
        <RolePanel role="killer" percent={region.killer} emphasized={activeRole === 'killer'} />
      </div>

      {region.isReal && (
        <div className="mt-6">
          <BalanceBar ratio={region.ratio} />
        </div>
      )}

      <footer className="mt-6 flex items-center justify-between text-xs text-bone-500">
        <span>{formatUpdated(region.lastUpdated, now, t)}</span>
        <span>{t('autoRefreshing')}</span>
      </footer>
    </section>
  );
}
