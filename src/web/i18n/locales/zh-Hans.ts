import type { Messages } from '../types';

const zhHans: Messages = {
  title: '血点奖励',
  subtitle: '按匹配地区，为选择人数较少的角色游玩时实时给予的奖励。',
  refreshAria: '从缓存刷新',
  updatedAgo: '更新于 {time}',
  language: '语言',

  searchPlaceholder: '搜索地区...',
  searchAria: '搜索地区',
  sort: '排序',
  sortName: '名称',
  sortBonus: '奖励',
  filterAll: '全部',
  filterSurvivor: '逃生者',
  filterKiller: '杀手',
  filterBonus: '有奖励',
  regionCount: '{total} 个地区中的 {shown} 个',

  roleSurvivor: '逃生者',
  roleKiller: '杀手',
  bonusBadge: '奖励',

  noBonus: '无奖励',
  noBonusSub: '两种角色均为 ×1.00',
  survivorBonus: '逃生者奖励 {mult}',
  killerBonus: '杀手奖励 {mult}',

  badgeStale: '已过时',
  badgeNoData: '无数据',
  badgeNoDataYet: '暂无数据',

  ratio: '比率 {value}',
  autoRefreshing: '自动刷新中',

  emptyTitle: '没有匹配的地区',
  emptyBody: '请尝试其他搜索词，或清除筛选条件以查看所有地区。',
  clearFilters: '清除筛选',
  errorTitle: '出了点问题',
  tryAgain: '重试',

  paginationPrev: '上一页',
  paginationNext: '下一页',

  statusDegraded: '正在显示最近一次的已知数值。部分地区目前未上报最新数据。',
  statusPaused: '为减轻 API 负担，实时轮询正在放缓。数值可能比平时更旧。',
  statusError: '轮询器无法连接到奖励服务。正在显示最近一次缓存的数据。',

  timeNever: '从不',
  timeUnknown: '未知',
  timeJustNow: '刚刚',
  timeSecondsAgo: '{n}秒前',
  timeMinutesAgo: '{n}分钟前',
  timeHoursAgo: '{n}小时前',
  timeDaysAgo: '{n}天前',

  bannerDisclaimer:
    '非官方粉丝项目，与 Behaviour Interactive 无关联，亦未获其认可。Dead by Daylight 和血点（Bloodpoints）是 Behaviour Interactive 的商标。',
  bannerNice:
    '如果你来自 Behaviour：请高抬贵手。这只是一个粉丝项目，由一名计算机科学专业的学生（撰写本文时）开发，而且本应用对 API 的占用极其轻微。',
  bannerContact: '如需联系我，本实例的联系邮箱是 {email}。',
  bannerDismiss: '知道了',
  footerDisclaimer:
    '非官方粉丝项目。与 Behaviour Interactive 无关联，亦未获其认可。Dead by Daylight 和血点（Bloodpoints）是 Behaviour Interactive 的商标。使用风险自负。',
  footerContact: '联系方式：{email}',
};

export default zhHans;
