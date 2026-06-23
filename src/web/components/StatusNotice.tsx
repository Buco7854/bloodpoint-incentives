import clsx from 'clsx';
import type { PollerStatus } from '@shared/types';
import { AlertIcon } from './icons';

const MESSAGES: Partial<Record<PollerStatus, string>> = {
  degraded: 'Showing the last known values. Some regions are not reporting fresh data right now.',
  paused: 'Live polling is backing off to stay friendly to the API. Values may be older than usual.',
  error: 'The poller cannot reach the incentive service. Showing whatever was last cached.',
};

interface Props {
  status: PollerStatus;
  reason: string | null;
}

export function StatusNotice({ status, reason }: Props) {
  const message = MESSAGES[status];
  if (!message) return null;
  const isError = status === 'error';
  return (
    <div
      className={clsx(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        isError
          ? 'border-blood-700/50 bg-blood-900/30 text-blood-100'
          : 'border-ember-500/30 bg-ember-600/10 text-ember-400',
      )}
      role="status"
    >
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p>{message}</p>
        {reason && <p className="mt-0.5 text-xs opacity-70">{reason}</p>}
      </div>
    </div>
  );
}
