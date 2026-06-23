import clsx from 'clsx';
import { useI18n } from '../i18n';
import type { Messages } from '../i18n/types';
import type { QuickFilter, SortKey } from '../lib/controls';
import { SearchIcon } from './icons';

const FILTERS: { key: QuickFilter; labelKey: keyof Messages }[] = [
  { key: 'all', labelKey: 'filterAll' },
  { key: 'survivor', labelKey: 'filterSurvivor' },
  { key: 'killer', labelKey: 'filterKiller' },
  { key: 'bonus', labelKey: 'filterBonus' },
];

const SORTS: { key: SortKey; labelKey: keyof Messages }[] = [
  { key: 'name', labelKey: 'sortName' },
  { key: 'bonus', labelKey: 'sortBonus' },
];

function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-xl border border-white/10 bg-void-700/60 p-1"
    >
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={clsx(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition',
            value === o.key
              ? 'bg-blood-600/90 text-white shadow-glow-soft'
              : 'text-bone-400 hover:text-bone-100',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filter: QuickFilter;
  onFilter: (f: QuickFilter) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  total: number;
  shown: number;
}

export function Controls({ search, onSearch, filter, onFilter, sort, onSort, total, shown }: Props) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1 sm:max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-500" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAria')}
            className="w-full rounded-xl border border-white/10 bg-void-700/70 py-2.5 pl-9 pr-3 text-sm text-bone-100 outline-none transition placeholder:text-bone-500 focus:border-blood-600/50 focus:ring-2 focus:ring-blood-600/20"
          />
        </label>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-bone-500">{t('sort')}</span>
          <Segmented
            options={SORTS.map((o) => ({ key: o.key, label: t(o.labelKey) }))}
            value={sort}
            onChange={onSort}
            ariaLabel={t('sort')}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto scroll-thin">
          <Segmented
            options={FILTERS.map((o) => ({ key: o.key, label: t(o.labelKey) }))}
            value={filter}
            onChange={onFilter}
            ariaLabel={t('filterAll')}
          />
        </div>
        <span className="tabular text-xs text-bone-500">
          {t('regionCount', { shown, total })}
        </span>
      </div>
    </div>
  );
}
