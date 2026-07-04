import { eventBonusPercent, headlinePercent, headlineRole } from '@shared/incentive';
import { formatMultFixed } from '@shared/format';
import type { BonusEvent, RegionIncentive } from '@shared/types';
import { useI18n } from '../i18n';
import { BloodpointIcon } from './BloodpointIcon';

interface Props {
  region: RegionIncentive;
  event: BonusEvent | null;
}

interface Row {
  label: string;
  value: number;
  emphasis?: boolean;
}

/**
 * The Dead by Daylight "Bloodpoint bonuses" breakdown for a region: Base, the
 * role's Queue Bonus, and any active global event (Bloodhunt/…), summed into a
 * Total — mirroring the additive multipliers the game shows in its lobby.
 */
export function BonusBreakdown({ region, event }: Props) {
  const { t } = useI18n();
  const role = headlineRole(region.survivor, region.killer);
  const queue = role ? headlinePercent(region.survivor, region.killer) / 100 : 0;
  const eventBonus = event ? eventBonusPercent(event.multiplier) / 100 : 0;
  const total = 1 + queue + eventBonus;

  const rows: Row[] = [{ label: t('breakdownBase'), value: 1 }];
  if (queue > 0 && role) {
    rows.push({ label: t(role === 'survivor' ? 'breakdownQueueSurvivor' : 'breakdownQueueKiller'), value: queue });
  }
  if (event && eventBonus > 0) {
    rows.push({ label: event.label, value: eventBonus, emphasis: true });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-void-800/50 p-4 sm:p-5">
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-bone-300">
        {t('breakdownTitle')}
      </h2>
      <ul className="flex flex-col gap-1.5 text-sm">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-bone-300">
              <BloodpointIcon className={r.emphasis ? 'h-3.5 w-3.5 text-blood-400' : 'h-3.5 w-3.5 text-bone-500'} />
              <span className={r.emphasis ? 'font-semibold text-blood-200' : ''}>{r.label}</span>
            </span>
            <span className="tabular text-bone-200">{formatMultFixed(r.value)}</span>
          </li>
        ))}
        <li className="mt-1.5 flex items-center justify-between gap-3 border-t border-white/10 pt-2">
          <span className="font-display font-semibold uppercase tracking-wide text-bone-100">
            {t('breakdownTotal')}
          </span>
          <span className="tabular text-lg font-bold text-blood-300">{formatMultFixed(total)}</span>
        </li>
      </ul>
    </div>
  );
}
