import type { Messages } from '../types';

const ptBR: Messages = {
  title: 'Incentivos de pontos de sangue',
  subtitle: 'Bônus ao vivo concedido por jogar com a função menos escolhida, por região de matchmaking.',
  refreshAria: 'Atualizar do cache',
  updatedAgo: 'atualizado {time}',
  language: 'Idioma',

  searchPlaceholder: 'Buscar regiões...',
  searchAria: 'Buscar regiões',
  sort: 'Ordenar',
  sortName: 'Nome',
  sortBonus: 'Bônus',
  filterAll: 'Todas',
  filterSurvivor: 'Sobrevivente',
  filterKiller: 'Assassino',
  filterBonus: 'Com bônus',
  regionCount: '{shown} de {total} regiões',

  roleSurvivor: 'Sobrevivente',
  roleKiller: 'Assassino',
  bonusBadge: 'Bônus',

  noBonus: 'Sem bônus',
  noBonusSub: '×1.00 para ambas as funções',
  survivorBonus: 'Bônus de sobrevivente de {mult}',
  killerBonus: 'Bônus de assassino de {mult}',

  badgeStale: 'Desatualizado',
  badgeNoData: 'Sem dados',
  badgeNoDataYet: 'Ainda sem dados',

  ratio: 'proporção {value}',
  autoRefreshing: 'atualização automática',

  emptyTitle: 'Nenhuma região corresponde',
  emptyBody: 'Tente outra busca ou limpe os filtros para ver todas as regiões.',
  clearFilters: 'Limpar filtros',
  errorTitle: 'Algo deu errado',
  tryAgain: 'Tentar novamente',

  paginationPrev: 'Ant.',
  paginationNext: 'Próx.',

  statusDegraded: 'Exibindo os últimos valores conhecidos. Algumas regiões não estão enviando dados recentes no momento.',
  statusPaused: 'A consulta ao vivo está sendo desacelerada para poupar a API. Os valores podem estar mais antigos que o normal.',
  statusError: 'O coletor não consegue acessar o serviço de incentivos. Exibindo o que foi armazenado em cache por último.',

  timeNever: 'nunca',
  timeUnknown: 'desconhecido',
  timeJustNow: 'agora mesmo',
  timeSecondsAgo: 'há {n}s',
  timeMinutesAgo: 'há {n}min',
  timeHoursAgo: 'há {n}h',
  timeDaysAgo: 'há {n}d',

  bannerDisclaimer:
    'Projeto de fãs não oficial, sem afiliação ou endosso da Behaviour Interactive. Dead by Daylight e os pontos de sangue (Bloodpoints) são marcas registradas da Behaviour Interactive.',
  bannerNice:
    'Se você é da Behaviour: por favor, seja gentil. É apenas um projeto de fã, desenvolvido por um estudante de ciência da computação (no momento em que isto foi escrito), e o aplicativo é extremamente cuidadoso com a API.',
  bannerContact: 'Se precisar entrar em contato comigo, o e-mail de contato desta instância é {email}.',
  bannerDismiss: 'Entendi',
  footerDisclaimer:
    'Projeto de fãs não oficial. Sem afiliação ou endosso da Behaviour Interactive. Dead by Daylight e os pontos de sangue (Bloodpoints) são marcas registradas da Behaviour Interactive. Use por sua conta e risco.',
  footerContact: 'Contato: {email}',
};

export default ptBR;
