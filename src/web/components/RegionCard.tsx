import clsx from 'clsx';
import { headlineRole } from '@shared/incentive';
import type { RegionIncentive } from '@shared/types';
import { useI18n } from '../i18n';
import { formatUpdated } from '../i18n/time';
import { type BonusTier, bonusTier } from '../lib/bonus';
import { CARD_GRADIENT } from '../lib/regionTheme';
import { Badge } from './Badge';
import { BalanceBar } from './BalanceBar';
import { BonusHeadline } from './BonusHeadline';
import { RegionLabel } from './RegionLabel';
import { RoleStat } from './RoleStat';

const GLOW: Record<BonusTier, string> = {
  none: '',
  low: '',
  mid: 'shadow-card',
  high: 'shadow-glow-soft',
  max: 'shadow-glow',
};

interface Props {
  region: RegionIncentive;
  now: number;
}

export function RegionCard({ region, now }: Props) {
  const { t } = useI18n();
  const activeRole = headlineRole(region.survivor, region.killer);
  const themeKey = activeRole ?? 'none';
  const tier = bonusTier(Math.max(region.survivor, region.killer));
  const neverReal = !region.isReal && region.lastUpdated === null;

  return (
    <article
      className={clsx(
        'flex animate-fade-up flex-col gap-4 rounded-2xl border bg-gradient-to-br p-5',
        CARD_GRADIENT[themeKey],
        GLOW[tier],
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <RegionLabel region={region} />
        {region.stale && !neverReal && <Badge tone="amber">{t('badgeStale')}</Badge>}
        {neverReal && <Badge tone="neutral">{t('badgeNoData')}</Badge>}
      </header>

      <BonusHeadline region={region} size="card" />

      <div className="grid gap-2">
        <RoleStat role="survivor" percent={region.survivor} emphasized={activeRole === 'survivor'} />
        <RoleStat role="killer" percent={region.killer} emphasized={activeRole === 'killer'} />
      </div>

      {region.isReal && <BalanceBar ratio={region.ratio} />}

      <footer className="mt-auto pt-1 text-[11px] text-bone-500">
        {formatUpdated(region.lastUpdated, now, t)}
      </footer>
    </article>
  );
}
