import { useState } from 'react';
import { useI18n } from '../i18n';

const STORAGE_KEY = 'dbd-bp-disclaimer-dismissed';

interface Props {
  contactEmail: string | null;
}

/** Shown to first-time visitors until dismissed (remembered in localStorage). */
export function DisclaimerBanner({ contactEmail }: Props) {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div className="border-b border-blood-800/30 bg-blood-900/20">
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-2.5 sm:px-6">
        <p className="flex-1 text-xs leading-relaxed text-bone-400">
          {t('bannerDisclaimer')} {t('bannerNice')}
          {contactEmail && (
            <>
              {' '}
              {t('bannerContact', { email: contactEmail })}
            </>
          )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-bone-300 transition hover:bg-white/5 hover:text-bone-100"
        >
          {t('bannerDismiss')}
        </button>
      </div>
    </div>
  );
}
