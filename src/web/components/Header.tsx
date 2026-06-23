import clsx from 'clsx';
import { relativeTime } from '@shared/format';
import type { IncentivesPayload, PollerStatus } from '@shared/types';
import { Badge } from './Badge';
import { Logo } from './Logo';
import { RefreshIcon } from './icons';

const STATUS_DOT: Record<PollerStatus, string> = {
  ok: 'bg-emerald-400',
  degraded: 'bg-ember-500',
  paused: 'bg-ember-500',
  error: 'bg-blood-500',
  initializing: 'bg-bone-500',
};

interface Props {
  data: IncentivesPayload | null;
  now: number;
  onRefresh: () => void;
  refreshing: boolean;
}

export function Header({ data, now, onRefresh, refreshing }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-void-900/80 backdrop-blur supports-[backdrop-filter]:bg-void-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          {data && (
            <Badge tone="neutral" className="hidden sm:inline-flex">
              {data.platform}
            </Badge>
          )}
          {data && (
            <span className="hidden items-center gap-2 text-xs text-bone-400 md:flex">
              <span className={clsx('h-2 w-2 rounded-full', STATUS_DOT[data.status])} />
              updated {relativeTime(data.updatedAt, now)}
            </span>
          )}
          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh from cache"
            title="Refresh from cache"
            className={clsx(
              'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-void-700/70 text-bone-300 transition hover:border-white/20 hover:text-bone-100',
              refreshing && 'animate-spin',
            )}
          >
            <RefreshIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
