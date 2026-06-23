import type { Messages } from '../types';

const ru: Messages = {
  title: 'Бонусы кровавых очков',
  subtitle: 'Текущий бонус за игру за менее популярную роль, по регионам подбора игроков.',
  refreshAria: 'Обновить из кеша',
  updatedAgo: 'обновлено {time}',
  language: 'Язык',

  searchPlaceholder: 'Поиск регионов...',
  searchAria: 'Поиск регионов',
  sort: 'Сортировка',
  sortName: 'Название',
  sortBonus: 'Бонус',
  filterAll: 'Все',
  filterSurvivor: 'Выживший',
  filterKiller: 'Убийца',
  filterBonus: 'С бонусом',
  regionCount: '{shown} из {total} регионов',

  roleSurvivor: 'Выживший',
  roleKiller: 'Убийца',
  bonusBadge: 'Бонус',

  noBonus: 'Без бонуса',
  noBonusSub: '×1.00 для обеих ролей',
  survivorBonus: 'Бонус за выжившего {mult}',
  killerBonus: 'Бонус за убийцу {mult}',

  badgeStale: 'Устарело',
  badgeNoData: 'Нет данных',
  badgeNoDataYet: 'Данных пока нет',

  ratio: 'соотношение {value}',
  autoRefreshing: 'автообновление',

  emptyTitle: 'Нет подходящих регионов',
  emptyBody: 'Попробуйте другой запрос или сбросьте фильтры, чтобы увидеть все регионы.',
  clearFilters: 'Сбросить фильтры',
  errorTitle: 'Что-то пошло не так',
  tryAgain: 'Повторить',

  paginationPrev: 'Назад',
  paginationNext: 'Далее',

  statusDegraded: 'Показаны последние известные значения. Некоторые регионы сейчас не передают свежие данные.',
  statusPaused: 'Опрос в реальном времени замедлен, чтобы не нагружать API. Значения могут быть старее обычного.',
  statusError: 'Сборщику не удаётся подключиться к службе бонусов. Показаны последние сохранённые в кеше данные.',

  timeNever: 'никогда',
  timeUnknown: 'неизвестно',
  timeJustNow: 'только что',
  timeSecondsAgo: '{n}с назад',
  timeMinutesAgo: '{n}мин назад',
  timeHoursAgo: '{n}ч назад',
  timeDaysAgo: '{n}д назад',

  bannerDisclaimer:
    'Неофициальный фанатский проект, не связанный с Behaviour Interactive и не одобренный ею. Dead by Daylight и кровавые очки (Bloodpoints) являются товарными знаками Behaviour Interactive.',
  bannerNice:
    'Если вы из Behaviour: пожалуйста, отнеситесь с пониманием. Это всего лишь фанатский проект, созданный студентом-программистом (на момент написания), и приложение крайне бережно относится к API.',
  bannerContact: 'Если вам нужно связаться со мной, контактный e-mail этого экземпляра: {email}.',
  bannerDismiss: 'Понятно',
  footerDisclaimer:
    'Неофициальный фанатский проект. Не связан с Behaviour Interactive и не одобрен ею. Dead by Daylight и кровавые очки (Bloodpoints) являются товарными знаками Behaviour Interactive. Используйте на свой страх и риск.',
  footerContact: 'Контакт: {email}',
};

export default ru;
