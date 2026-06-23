import type { Messages } from '../types';

const de: Messages = {
  title: 'Blutpunkte-Anreize',
  subtitle: 'Live-Bonus für das Spielen der unterbesetzten Rolle, pro Matchmaking-Region.',
  refreshAria: 'Aus dem Cache aktualisieren',
  updatedAgo: 'aktualisiert {time}',
  language: 'Sprache',

  searchPlaceholder: 'Regionen suchen...',
  searchAria: 'Regionen suchen',
  sort: 'Sortieren',
  sortName: 'Name',
  sortBonus: 'Bonus',
  filterAll: 'Alle',
  filterSurvivor: 'Überlebender',
  filterKiller: 'Killer',
  filterBonus: 'Mit Bonus',
  regionCount: '{shown} von {total} Regionen',

  roleSurvivor: 'Überlebender',
  roleKiller: 'Killer',
  bonusBadge: 'Bonus',

  noBonus: 'Kein Bonus',
  noBonusSub: '×1.00 für beide Rollen',
  survivorBonus: '{mult} Überlebenden-Bonus',
  killerBonus: '{mult} Killer-Bonus',

  badgeStale: 'Veraltet',
  badgeNoData: 'Keine Daten',
  badgeNoDataYet: 'Noch keine Daten',

  ratio: 'Verhältnis {value}',
  autoRefreshing: 'wird automatisch aktualisiert',

  emptyTitle: 'Keine Region passt',
  emptyBody: 'Versuche eine andere Suche oder setze die Filter zurück, um alle Regionen zu sehen.',
  clearFilters: 'Filter zurücksetzen',
  errorTitle: 'Etwas ist schiefgelaufen',
  tryAgain: 'Erneut versuchen',

  paginationPrev: 'Zurück',
  paginationNext: 'Weiter',

  statusDegraded: 'Es werden die letzten bekannten Werte angezeigt. Einige Regionen liefern derzeit keine aktuellen Daten.',
  statusPaused: 'Die Live-Abfrage wird gedrosselt, um die API zu schonen. Die Werte können älter als gewöhnlich sein.',
  statusError: 'Der Abrufdienst kann den Anreiz-Dienst nicht erreichen. Es werden die zuletzt zwischengespeicherten Werte angezeigt.',

  timeNever: 'nie',
  timeUnknown: 'unbekannt',
  timeJustNow: 'gerade eben',
  timeSecondsAgo: 'vor {n}s',
  timeMinutesAgo: 'vor {n}min',
  timeHoursAgo: 'vor {n}h',
  timeDaysAgo: 'vor {n}T',

  bannerDisclaimer:
    'Inoffizielles Fan-Projekt, weder mit Behaviour Interactive verbunden noch von ihnen unterstützt. Dead by Daylight und Blutpunkte (Bloodpoints) sind Marken von Behaviour Interactive.',
  bannerNice:
    'Falls du von Behaviour bist: Bitte sei nett. Es ist nur ein Fan-Projekt, entwickelt von einem Informatikstudenten (zum Zeitpunkt der Erstellung), und die App geht äußerst schonend mit der API um.',
  bannerContact: 'Falls du mich kontaktieren musst, lautet die Kontakt-E-Mail dieser Instanz {email}.',
  bannerDismiss: 'Verstanden',
  footerDisclaimer:
    'Inoffizielles Fan-Projekt. Weder mit Behaviour Interactive verbunden noch von ihnen unterstützt. Dead by Daylight und Blutpunkte (Bloodpoints) sind Marken von Behaviour Interactive. Nutzung auf eigene Gefahr.',
  footerContact: 'Kontakt: {email}',
};

export default de;
