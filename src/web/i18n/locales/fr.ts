import type { Messages } from '../types';

const fr: Messages = {
  title: 'Primes de points de sang',
  subtitle: 'Bonus en direct accordé pour jouer le rôle sous-représenté, par région de matchmaking.',
  refreshAria: 'Actualiser depuis le cache',
  updatedAgo: 'mis à jour {time}',
  language: 'Langue',

  searchPlaceholder: 'Rechercher des régions...',
  searchAria: 'Rechercher des régions',
  sort: 'Trier',
  sortName: 'Nom',
  sortBonus: 'Bonus',
  filterAll: 'Tout',
  filterSurvivor: 'Survivant',
  filterKiller: 'Tueur',
  filterBonus: 'Avec bonus',
  regionCount: '{shown} régions sur {total}',

  roleSurvivor: 'Survivant',
  roleKiller: 'Tueur',
  bonusBadge: 'Bonus',

  noBonus: 'Aucun bonus',
  noBonusSub: '×1.00 pour les deux rôles',
  survivorBonus: 'Bonus survivant de {mult}',
  killerBonus: 'Bonus tueur de {mult}',

  badgeStale: 'Obsolète',
  badgeNoData: 'Aucune donnée',
  badgeNoDataYet: 'Pas encore de données',

  ratio: 'ratio {value}',
  autoRefreshing: 'actualisation auto',

  emptyTitle: 'Aucune région ne correspond',
  emptyBody: 'Essayez une autre recherche ou effacez les filtres pour voir toutes les régions.',
  clearFilters: 'Effacer les filtres',
  errorTitle: "Une erreur s'est produite",
  tryAgain: 'Réessayer',

  paginationPrev: 'Préc.',
  paginationNext: 'Suiv.',

  statusDegraded: 'Affichage des dernières valeurs connues. Certaines régions ne transmettent pas de données récentes pour le moment.',
  statusPaused: "L'interrogation en direct est ralentie pour ménager l'API. Les valeurs peuvent être plus anciennes que d'habitude.",
  statusError: "Le collecteur ne parvient pas à joindre le service de primes. Affichage des dernières données mises en cache.",

  timeNever: 'jamais',
  timeUnknown: 'inconnu',
  timeJustNow: "à l'instant",
  timeSecondsAgo: 'il y a {n}s',
  timeMinutesAgo: 'il y a {n}min',
  timeHoursAgo: 'il y a {n}h',
  timeDaysAgo: 'il y a {n}j',

  bannerDisclaimer:
    "Projet de fans non officiel, sans affiliation avec Behaviour Interactive ni approbation de leur part. Dead by Daylight et les points de sang (Bloodpoints) sont des marques de Behaviour Interactive.",
  bannerNice:
    "Si vous travaillez chez Behaviour : soyez indulgents, s'il vous plaît. Ce n'est qu'un projet de fan, développé par un étudiant en informatique (au moment de l'écriture), et l'application est extrêmement respectueuse de l'API.",
  bannerContact: "Si vous avez besoin de me contacter, l'adresse e-mail de cette instance est {email}.",
  bannerDismiss: 'Compris',
  footerDisclaimer:
    "Projet de fans non officiel. Sans affiliation avec Behaviour Interactive ni approbation de leur part. Dead by Daylight et les points de sang (Bloodpoints) sont des marques de Behaviour Interactive. Utilisation à vos propres risques.",
  footerContact: 'Contact : {email}',
};

export default fr;
