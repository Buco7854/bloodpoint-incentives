import type { Messages } from '../types';

const es: Messages = {
  title: 'Incentivos de puntos de sangre',
  subtitle: 'Bonificación en directo otorgada por jugar con el rol menos elegido, por región de emparejamiento.',
  refreshAria: 'Actualizar desde la caché',
  updatedAgo: 'actualizado {time}',
  language: 'Idioma',

  searchPlaceholder: 'Buscar regiones...',
  searchAria: 'Buscar regiones',
  sort: 'Ordenar',
  sortName: 'Nombre',
  sortBonus: 'Bonificación',
  filterAll: 'Todas',
  filterSurvivor: 'Superviviente',
  filterKiller: 'Asesino',
  filterBonus: 'Con bonificación',
  regionCount: '{shown} de {total} regiones',

  roleSurvivor: 'Superviviente',
  roleKiller: 'Asesino',
  bonusBadge: 'Bonificación',

  noBonus: 'Sin bonificación',
  noBonusSub: '×1.00 para ambos roles',
  survivorBonus: 'Bonificación de superviviente de {mult}',
  killerBonus: 'Bonificación de asesino de {mult}',

  badgeStale: 'Obsoleto',
  badgeNoData: 'Sin datos',
  badgeNoDataYet: 'Aún sin datos',

  ratio: 'proporción {value}',
  autoRefreshing: 'actualización automática',

  emptyTitle: 'Ninguna región coincide',
  emptyBody: 'Prueba otra búsqueda o borra los filtros para ver todas las regiones.',
  clearFilters: 'Borrar filtros',
  errorTitle: 'Algo salió mal',
  tryAgain: 'Reintentar',

  paginationPrev: 'Ant.',
  paginationNext: 'Sig.',

  statusDegraded: 'Se muestran los últimos valores conocidos. Algunas regiones no están enviando datos recientes en este momento.',
  statusPaused: 'El sondeo en directo se está ralentizando para no sobrecargar la API. Los valores pueden ser más antiguos de lo habitual.',
  statusError: 'El recopilador no puede conectar con el servicio de incentivos. Se muestra lo último que se guardó en caché.',

  timeNever: 'nunca',
  timeUnknown: 'desconocido',
  timeJustNow: 'ahora mismo',
  timeSecondsAgo: 'hace {n}s',
  timeMinutesAgo: 'hace {n}min',
  timeHoursAgo: 'hace {n}h',
  timeDaysAgo: 'hace {n}d',

  bannerDisclaimer:
    'Proyecto de fans no oficial, sin afiliación ni respaldo de Behaviour Interactive. Dead by Daylight y los puntos de sangre (Bloodpoints) son marcas comerciales de Behaviour Interactive.',
  bannerNice:
    'Si eres de Behaviour: por favor, sé amable. Es solo un proyecto de fans, desarrollado por un estudiante de informática (en el momento de escribir esto), y la aplicación es extremadamente respetuosa con la API.',
  bannerContact: 'Si necesitas contactar conmigo, el correo de contacto de esta instancia es {email}.',
  bannerDismiss: 'Entendido',
  footerDisclaimer:
    'Proyecto de fans no oficial. Sin afiliación ni respaldo de Behaviour Interactive. Dead by Daylight y los puntos de sangre (Bloodpoints) son marcas comerciales de Behaviour Interactive. Uso bajo tu propia responsabilidad.',
  footerContact: 'Contacto: {email}',
};

export default es;
