import type { Messages } from '../types';

const zhHant: Messages = {
  title: '血點獎勵',
  subtitle: '依配對地區，為選擇人數較少的角色遊玩時即時給予的獎勵。',
  refreshAria: '從快取重新整理',
  updatedAgo: '更新於 {time}',
  language: '語言',

  searchPlaceholder: '搜尋地區...',
  searchAria: '搜尋地區',
  sort: '排序',
  sortName: '名稱',
  sortBonus: '獎勵',
  filterAll: '全部',
  filterSurvivor: '逃生者',
  filterKiller: '殺手',
  filterBonus: '有獎勵',
  regionCount: '{total} 個地區中的 {shown} 個',

  roleSurvivor: '逃生者',
  roleKiller: '殺手',
  bonusBadge: '獎勵',

  noBonus: '無獎勵',
  noBonusSub: '兩種角色皆為 ×1.00',
  survivorBonus: '逃生者獎勵 {mult}',
  killerBonus: '殺手獎勵 {mult}',

  badgeStale: '已過時',
  badgeNoData: '無資料',
  badgeNoDataYet: '尚無資料',

  ratio: '比率 {value}',
  autoRefreshing: '自動重新整理中',

  emptyTitle: '沒有符合的地區',
  emptyBody: '請嘗試其他搜尋詞，或清除篩選條件以查看所有地區。',
  clearFilters: '清除篩選',
  errorTitle: '發生了一些問題',
  tryAgain: '重試',

  paginationPrev: '上一頁',
  paginationNext: '下一頁',

  statusDegraded: '正在顯示最近一次的已知數值。部分地區目前未回報最新資料。',
  statusPaused: '為減輕 API 負擔，即時輪詢正在放緩。數值可能比平時更舊。',
  statusError: '輪詢器無法連線到獎勵服務。正在顯示最近一次快取的資料。',

  timeNever: '從不',
  timeUnknown: '未知',
  timeJustNow: '剛剛',
  timeSecondsAgo: '{n}秒前',
  timeMinutesAgo: '{n}分鐘前',
  timeHoursAgo: '{n}小時前',
  timeDaysAgo: '{n}天前',

  bannerDisclaimer:
    '非官方粉絲專案，與 Behaviour Interactive 無關聯，亦未獲其認可。Dead by Daylight 和血點（Bloodpoints）是 Behaviour Interactive 的商標。',
  bannerNice:
    '如果你來自 Behaviour：請高抬貴手。這只是一個粉絲專案，由一名資訊工程系的學生（撰寫本文時）開發，而且本應用程式對 API 的佔用極其輕微。',
  bannerContact: '如需聯絡我，本執行個體的聯絡電子郵件是 {email}。',
  bannerDismiss: '知道了',
  footerDisclaimer:
    '非官方粉絲專案。與 Behaviour Interactive 無關聯，亦未獲其認可。Dead by Daylight 和血點（Bloodpoints）是 Behaviour Interactive 的商標。使用風險自負。',
  footerContact: '聯絡方式：{email}',
};

export default zhHant;
