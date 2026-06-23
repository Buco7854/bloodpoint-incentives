import clsx from 'clsx';
import type { PollerStatus } from '@shared/types';
import { useI18n } from '../i18n';
import type { Messages } from '../i18n/types';
import { AlertIcon } from './icons';

const MESSAGE_KEY: Partial<Record<PollerStatus, keyof Messages>> = {
  degraded: 'statusDegraded',
  paused: 'statusPaused',
  error: 'statusError',
};

interface Props {
  status: PollerStatus;
  reason: string | null;
}

export function StatusNotice({ status, reason }: Props) {
  const { t } = useI18n();
  const key = MESSAGE_KEY[status];
  if (!key) return null;
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
        <p>{t(key)}</p>
        {reason && <p className="mt-0.5 text-xs opacity-70">{reason}</p>}
      </div>
    </div>
  );
}
