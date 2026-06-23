import { useState } from 'react';

const STORAGE_KEY = 'dbd-bp-disclaimer-dismissed';

/** Shown to first-time visitors until dismissed (remembered in localStorage). */
export function DisclaimerBanner() {
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
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <p className="flex-1 text-xs text-bone-400">
          Unofficial fan project, not affiliated with or endorsed by Behaviour Interactive. Dead by
          Daylight and Bloodpoints are trademarks of Behaviour Interactive.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-bone-300 transition hover:bg-white/5 hover:text-bone-100"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
