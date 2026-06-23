import type { Messages } from '../types';

const pl: Messages = {
  title: 'Premie za punkty krwi',
  subtitle: 'Premia na żywo przyznawana za grę mniej popularną rolą, według regionu dobierania graczy.',
  refreshAria: 'Odśwież z pamięci podręcznej',
  updatedAgo: 'zaktualizowano {time}',
  language: 'Język',

  searchPlaceholder: 'Szukaj regionów...',
  searchAria: 'Szukaj regionów',
  sort: 'Sortuj',
  sortName: 'Nazwa',
  sortBonus: 'Premia',
  filterAll: 'Wszystkie',
  filterSurvivor: 'Ocalały',
  filterKiller: 'Zabójca',
  filterBonus: 'Z premią',
  regionCount: '{shown} z {total} regionów',

  roleSurvivor: 'Ocalały',
  roleKiller: 'Zabójca',
  bonusBadge: 'Premia',

  noBonus: 'Brak premii',
  noBonusSub: '×1.00 dla obu ról',
  survivorBonus: 'Premia za ocalałego {mult}',
  killerBonus: 'Premia za zabójcę {mult}',

  badgeStale: 'Nieaktualne',
  badgeNoData: 'Brak danych',
  badgeNoDataYet: 'Jeszcze brak danych',

  ratio: 'stosunek {value}',
  autoRefreshing: 'automatyczne odświeżanie',

  emptyTitle: 'Brak pasujących regionów',
  emptyBody: 'Spróbuj innego wyszukiwania lub wyczyść filtry, aby zobaczyć wszystkie regiony.',
  clearFilters: 'Wyczyść filtry',
  errorTitle: 'Coś poszło nie tak',
  tryAgain: 'Spróbuj ponownie',

  paginationPrev: 'Wstecz',
  paginationNext: 'Dalej',

  statusDegraded: 'Wyświetlane są ostatnie znane wartości. Niektóre regiony nie przesyłają obecnie świeżych danych.',
  statusPaused: 'Odpytywanie na żywo jest spowalniane, aby nie obciążać API. Wartości mogą być starsze niż zwykle.',
  statusError: 'Odpytujący nie może połączyć się z usługą premii. Wyświetlane są ostatnio zapisane dane.',

  timeNever: 'nigdy',
  timeUnknown: 'nieznane',
  timeJustNow: 'przed chwilą',
  timeSecondsAgo: '{n}s temu',
  timeMinutesAgo: '{n}min temu',
  timeHoursAgo: '{n}godz. temu',
  timeDaysAgo: '{n}dni temu',

  bannerDisclaimer:
    'Nieoficjalny projekt fanowski, niezwiązany z Behaviour Interactive ani przez nich nieautoryzowany. Dead by Daylight oraz punkty krwi (Bloodpoints) są znakami towarowymi Behaviour Interactive.',
  bannerNice:
    'Jeśli jesteś z Behaviour: proszę, bądź wyrozumiały. To tylko projekt fanowski, stworzony przez studenta informatyki (w chwili pisania), a aplikacja jest niezwykle oszczędna w korzystaniu z API.',
  bannerContact: 'Jeśli musisz się ze mną skontaktować, adres e-mail tej instancji to {email}.',
  bannerDismiss: 'Rozumiem',
  footerDisclaimer:
    'Nieoficjalny projekt fanowski. Niezwiązany z Behaviour Interactive ani przez nich nieautoryzowany. Dead by Daylight oraz punkty krwi (Bloodpoints) są znakami towarowymi Behaviour Interactive. Korzystasz na własne ryzyko.',
  footerContact: 'Kontakt: {email}',
};

export default pl;
