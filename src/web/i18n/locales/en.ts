import type { Messages } from '../types';

const en: Messages = {
  title: 'Bloodpoint Incentives',
  subtitle: 'Live bonus awarded for playing the under-populated role, per matchmaking region.',
  refreshAria: 'Refresh from cache',
  updatedAgo: 'updated {time}',
  language: 'Language',

  searchPlaceholder: 'Search regions...',
  searchAria: 'Search regions',
  sort: 'Sort',
  sortName: 'Name',
  sortBonus: 'Bonus',
  filterAll: 'All',
  filterSurvivor: 'Survivor',
  filterKiller: 'Killer',
  filterBonus: 'Has bonus',
  regionCount: '{shown} of {total} regions',

  roleSurvivor: 'Survivor',
  roleKiller: 'Killer',
  bonusBadge: 'Bonus',

  noBonus: 'No bonus',
  noBonusSub: '×1.00 for both roles',
  survivorBonus: '{mult} survivor bonus',
  killerBonus: '{mult} killer bonus',

  badgeStale: 'Stale',
  badgeNoData: 'No data',
  badgeNoDataYet: 'No data yet',

  ratio: 'ratio {value}',
  autoRefreshing: 'auto-refreshing',

  emptyTitle: 'No regions match',
  emptyBody: 'Try a different search or clear the filters to see every region.',
  clearFilters: 'Clear filters',
  errorTitle: 'Something went wrong',
  tryAgain: 'Try again',

  paginationPrev: 'Prev',
  paginationNext: 'Next',

  statusDegraded: 'Showing the last known values. Some regions are not reporting fresh data right now.',
  statusPaused: 'Live polling is backing off to stay friendly to the API. Values may be older than usual.',
  statusError: 'The poller cannot reach the incentive service. Showing whatever was last cached.',

  timeNever: 'never',
  timeUnknown: 'unknown',
  timeJustNow: 'just now',
  timeSecondsAgo: '{n}s ago',
  timeMinutesAgo: '{n}m ago',
  timeHoursAgo: '{n}h ago',
  timeDaysAgo: '{n}d ago',

  bannerDisclaimer:
    'Unofficial fan project, not affiliated with or endorsed by Behaviour Interactive. Dead by Daylight and Bloodpoints are trademarks of Behaviour Interactive.',
  bannerNice:
    "If you're from Behaviour: please be nice. It's only a fan project, developed by a computer science student (at the time of writing), and the app is extremely gentle on the API.",
  bannerContact: 'If you need to contact me, this instance contact email is {email}.',
  bannerDismiss: 'Got it',
  footerDisclaimer:
    'Unofficial fan project. Not affiliated with or endorsed by Behaviour Interactive. Dead by Daylight and Bloodpoints are trademarks of Behaviour Interactive. Use at your own risk.',
  footerContact: 'Contact: {email}',
};

export default en;
