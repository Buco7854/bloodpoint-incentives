import type { Messages } from '../types';

const it: Messages = {
  title: 'Incentivi punti sangue',
  subtitle: 'Bonus in tempo reale assegnato per giocare il ruolo meno scelto, per regione di matchmaking.',
  refreshAria: 'Aggiorna dalla cache',
  updatedAgo: 'aggiornato {time}',
  language: 'Lingua',

  searchPlaceholder: 'Cerca regioni...',
  searchAria: 'Cerca regioni',
  sort: 'Ordina',
  sortName: 'Nome',
  sortBonus: 'Bonus',
  filterAll: 'Tutte',
  filterSurvivor: 'Sopravvissuto',
  filterKiller: 'Killer',
  filterBonus: 'Con bonus',
  regionCount: '{shown} di {total} regioni',

  roleSurvivor: 'Sopravvissuto',
  roleKiller: 'Killer',
  bonusBadge: 'Bonus',

  noBonus: 'Nessun bonus',
  noBonusSub: '×1.00 per entrambi i ruoli',
  survivorBonus: 'Bonus sopravvissuto di {mult}',
  killerBonus: 'Bonus killer di {mult}',

  badgeStale: 'Obsoleto',
  badgeNoData: 'Nessun dato',
  badgeNoDataYet: 'Ancora nessun dato',

  ratio: 'rapporto {value}',
  autoRefreshing: 'aggiornamento automatico',

  emptyTitle: 'Nessuna regione corrisponde',
  emptyBody: 'Prova una ricerca diversa o cancella i filtri per vedere tutte le regioni.',
  clearFilters: 'Cancella filtri',
  errorTitle: 'Qualcosa è andato storto',
  tryAgain: 'Riprova',

  paginationPrev: 'Prec.',
  paginationNext: 'Succ.',

  statusDegraded: 'Vengono mostrati gli ultimi valori noti. Al momento alcune regioni non stanno trasmettendo dati aggiornati.',
  statusPaused: 'Il polling in tempo reale sta rallentando per non sovraccaricare le API. I valori potrebbero essere più vecchi del solito.',
  statusError: 'Il poller non riesce a raggiungere il servizio incentivi. Vengono mostrati gli ultimi dati memorizzati nella cache.',

  timeNever: 'mai',
  timeUnknown: 'sconosciuto',
  timeJustNow: 'proprio ora',
  timeSecondsAgo: '{n}s fa',
  timeMinutesAgo: '{n}min fa',
  timeHoursAgo: '{n}h fa',
  timeDaysAgo: '{n}g fa',

  bannerDisclaimer:
    'Progetto amatoriale non ufficiale, non affiliato né approvato da Behaviour Interactive. Dead by Daylight e i punti sangue (Bloodpoints) sono marchi di Behaviour Interactive.',
  bannerNice:
    "Se lavori per Behaviour: per favore, sii gentile. È solo un progetto amatoriale, sviluppato da uno studente di informatica (al momento della scrittura), e l'app è estremamente rispettosa delle API.",
  bannerContact: "Se hai bisogno di contattarmi, l'email di contatto di questa istanza è {email}.",
  bannerDismiss: 'Ho capito',
  footerDisclaimer:
    'Progetto amatoriale non ufficiale. Non affiliato né approvato da Behaviour Interactive. Dead by Daylight e i punti sangue (Bloodpoints) sono marchi di Behaviour Interactive. Usa a tuo rischio.',
  footerContact: 'Contatto: {email}',
};

export default it;
