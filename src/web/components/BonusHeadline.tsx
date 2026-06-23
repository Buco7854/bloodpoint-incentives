import clsx from 'clsx';
import { formatMultiplier, formatPercent } from '@shared/format';
import { headlinePercent, headlineRole } from '@shared/incentive';
import type { RegionIncentive } from '@shared/types';
import { useI18n } from '../i18n';
import { HEADLINE_COLOR, ROLE_META } from '../lib/regionTheme';
import { BloodpointIcon } from './BloodpointIcon';

type Size = 'card' | 'hero';

const SIZES: Record<Size, { num: string; role: string; bp: string; none: string; sub: string }> = {
  card: { num: 'text-5xl', role: 'h-6 w-6', bp: 'h-7 w-7', none: 'text-2xl', sub: 'text-sm' },
  hero: { num: 'text-6xl sm:text-7xl', role: 'h-9 w-9', bp: 'h-11 w-11', none: 'text-4xl', sub: 'text-base' },
};

interface Props {
  region: RegionIncentive;
  size: Size;
}

/** The headline number (the higher role's bonus) with role + Bloodpoint icons. */
export function BonusHeadline({ region, size }: Props) {
  const { t } = useI18n();
  const activeRole = headlineRole(region.survivor, region.killer);
  const headline = headlinePercent(region.survivor, region.killer);
  const s = SIZES[size];

  if (!activeRole) {
    return (
      <div className="flex items-center gap-3">
        <BloodpointIcon className={clsx(s.bp, 'opacity-50')} />
        <div>
          <div className={clsx('font-display font-semibold text-bone-200', s.none)}>{t('noBonus')}</div>
          <div className={clsx('text-bone-500', s.sub)}>{t('noBonusSub')}</div>
        </div>
      </div>
    );
  }

  const { Icon } = ROLE_META[activeRole];
  const subKey = activeRole === 'survivor' ? 'survivorBonus' : 'killerBonus';
  return (
    <div className="flex items-end gap-3">
      <div className="flex items-center gap-1.5 pb-1">
        <Icon className={clsx(s.role, HEADLINE_COLOR[activeRole])} />
        <BloodpointIcon className={s.bp} />
      </div>
      <div className="leading-none">
        <div className={clsx('font-display font-bold tabular', s.num, HEADLINE_COLOR[activeRole])}>
          {formatPercent(headline)}
        </div>
        <div className={clsx('mt-1.5 text-bone-400', s.sub)}>
          {t(subKey, { mult: formatMultiplier(headline) })}
        </div>
      </div>
    </div>
  );
}
