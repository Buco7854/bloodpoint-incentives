import type { Messages } from '../types';

const ja: Messages = {
  title: 'ブラッドポイント インセンティブ',
  subtitle: 'マッチメイキング地域ごとに、人数が少ない役割でプレイすると得られるリアルタイムのボーナス。',
  refreshAria: 'キャッシュから更新',
  updatedAgo: '更新 {time}',
  language: '言語',

  searchPlaceholder: '地域を検索...',
  searchAria: '地域を検索',
  sort: '並び替え',
  sortName: '名前',
  sortBonus: 'ボーナス',
  filterAll: 'すべて',
  filterSurvivor: 'サバイバー',
  filterKiller: 'キラー',
  filterBonus: 'ボーナスあり',
  regionCount: '{total}地域中{shown}地域',

  roleSurvivor: 'サバイバー',
  roleKiller: 'キラー',
  bonusBadge: 'ボーナス',

  noBonus: 'ボーナスなし',
  noBonusSub: '両方の役割で×1.00',
  survivorBonus: 'サバイバーボーナス {mult}',
  killerBonus: 'キラーボーナス {mult}',

  badgeStale: '古いデータ',
  badgeNoData: 'データなし',
  badgeNoDataYet: 'まだデータがありません',

  ratio: '比率 {value}',
  autoRefreshing: '自動更新中',

  emptyTitle: '一致する地域がありません',
  emptyBody: '別のキーワードで検索するか、フィルターをクリアしてすべての地域を表示してください。',
  clearFilters: 'フィルターをクリア',
  errorTitle: '問題が発生しました',
  tryAgain: '再試行',

  paginationPrev: '前へ',
  paginationNext: '次へ',

  statusDegraded: '最後に取得した値を表示しています。一部の地域では現在、最新データが送信されていません。',
  statusPaused: 'APIへの負荷を抑えるため、リアルタイム取得の頻度を下げています。値が通常より古い場合があります。',
  statusError: 'ポーラーがインセンティブサービスに接続できません。最後にキャッシュされた値を表示しています。',

  timeNever: 'なし',
  timeUnknown: '不明',
  timeJustNow: 'たった今',
  timeSecondsAgo: '{n}秒前',
  timeMinutesAgo: '{n}分前',
  timeHoursAgo: '{n}時間前',
  timeDaysAgo: '{n}日前',

  bannerDisclaimer:
    '非公式のファンプロジェクトであり、Behaviour Interactiveと提携・承認を受けたものではありません。Dead by Daylightおよびブラッドポイント（Bloodpoints）はBehaviour Interactiveの商標です。',
  bannerNice:
    'Behaviourの方へ。どうかお手柔らかにお願いします。これは（執筆時点で）情報科学を学ぶ学生が開発した、ただのファンプロジェクトであり、APIへの負荷は極めて軽くなっています。',
  bannerContact: 'ご連絡が必要な場合、このインスタンスの連絡先メールアドレスは {email} です。',
  bannerDismiss: '了解',
  footerDisclaimer:
    '非公式のファンプロジェクトです。Behaviour Interactiveと提携・承認を受けたものではありません。Dead by Daylightおよびブラッドポイント（Bloodpoints）はBehaviour Interactiveの商標です。ご利用は自己責任でお願いします。',
  footerContact: '連絡先: {email}',
};

export default ja;
