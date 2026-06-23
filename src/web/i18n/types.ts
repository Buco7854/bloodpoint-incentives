/** Every translatable UI string. Each locale must provide all of them. */
export interface Messages {
  // header / app
  title: string;
  subtitle: string;
  refreshAria: string;
  updatedAgo: string; // "updated {time}"
  language: string;

  // controls
  searchPlaceholder: string;
  searchAria: string;
  sort: string;
  sortName: string;
  sortBonus: string;
  filterAll: string;
  filterSurvivor: string;
  filterKiller: string;
  filterBonus: string;
  regionCount: string; // "{shown} of {total} regions"

  // roles
  roleSurvivor: string;
  roleKiller: string;
  bonusBadge: string;

  // headline
  noBonus: string;
  noBonusSub: string;
  survivorBonus: string; // "{mult} survivor bonus"
  killerBonus: string; // "{mult} killer bonus"

  // badges
  badgeStale: string;
  badgeNoData: string;
  badgeNoDataYet: string;

  // balance bar
  ratio: string; // "ratio {value}"
  autoRefreshing: string;

  // states
  emptyTitle: string;
  emptyBody: string;
  clearFilters: string;
  errorTitle: string;
  tryAgain: string;

  // pagination
  paginationPrev: string;
  paginationNext: string;

  // status notices
  statusDegraded: string;
  statusPaused: string;
  statusError: string;

  // relative time
  timeNever: string;
  timeUnknown: string;
  timeJustNow: string;
  timeSecondsAgo: string; // "{n}s ago"
  timeMinutesAgo: string; // "{n}m ago"
  timeHoursAgo: string; // "{n}h ago"
  timeDaysAgo: string; // "{n}d ago"

  // banner + footer
  bannerDisclaimer: string;
  bannerNice: string;
  bannerContact: string; // "... {email}."
  bannerDismiss: string;
  footerDisclaimer: string;
  footerContact: string; // "Contact: {email}"
}

/** Dead by Daylight's supported interface languages. */
export const LANGS = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'es-LA', name: 'Español (LA)' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt-BR', name: 'Português (BR)' },
  { code: 'ru', name: 'Русский' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh-Hans', name: '简体中文' },
  { code: 'zh-Hant', name: '繁體中文' },
  { code: 'th', name: 'ไทย' },
  { code: 'tr', name: 'Türkçe' },
] as const;

export type Lang = (typeof LANGS)[number]['code'];
