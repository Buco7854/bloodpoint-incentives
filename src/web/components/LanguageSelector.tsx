import { useI18n } from '../i18n';
import { type Lang, LANGS } from '../i18n/types';
import { ChevronDownIcon } from './icons';

/** Native select (accessible, works everywhere) styled to match the theme. */
export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="relative">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label={t('language')}
        className="appearance-none rounded-xl border border-white/10 bg-void-700/70 py-2 pl-3 pr-8 text-sm text-bone-200 outline-none transition hover:border-white/20 focus:border-blood-600/50"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} className="bg-void-800 text-bone-100">
            {l.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-bone-500" />
    </div>
  );
}
