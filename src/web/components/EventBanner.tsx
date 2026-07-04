import { formatMult } from '@shared/format';
import type { BonusEvent } from '@shared/types';
import { useI18n } from '../i18n';
import { BloodpointIcon } from './BloodpointIcon';

interface Props {
  event: BonusEvent | null;
}

/** Top banner announcing the globally-active Bloodpoint event. */
export function EventBanner({ event }: Props) {
  const { t, lang } = useI18n();
  if (!event) return null;

  let ends = '';
  try {
    ends = new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(event.endsAt),
    );
  } catch {
    ends = '';
  }

  return (
    <div className="border-b border-blood-500/30 bg-gradient-to-r from-blood-600/20 to-blood-500/[0.04]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <BloodpointIcon className="h-5 w-5 shrink-0" />
        <p className="flex-1 text-xs leading-relaxed text-bone-100 sm:text-sm">
          <span className="font-display font-semibold text-blood-200">
            {t('eventBannerTitle', { label: event.label })}
          </span>{' '}
          <span className="text-bone-200">{t('eventBannerBody', { mult: formatMult(event.multiplier) })}</span>
          {ends && <span className="ml-1 whitespace-nowrap text-bone-400">· {t('eventEndsAt', { time: ends })}</span>}
        </p>
      </div>
    </div>
  );
}
