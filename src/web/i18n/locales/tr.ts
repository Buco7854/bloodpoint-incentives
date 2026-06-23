import type { Messages } from '../types';

const tr: Messages = {
  title: 'Kan Puanı Teşvikleri',
  subtitle: 'Eşleştirme bölgesine göre, daha az oynanan rolü oynadığınızda verilen canlı bonus.',
  refreshAria: 'Önbellekten yenile',
  updatedAgo: 'güncellendi {time}',
  language: 'Dil',

  searchPlaceholder: 'Bölge ara...',
  searchAria: 'Bölge ara',
  sort: 'Sırala',
  sortName: 'Ad',
  sortBonus: 'Bonus',
  filterAll: 'Tümü',
  filterSurvivor: 'Hayatta Kalan',
  filterKiller: 'Katil',
  filterBonus: 'Bonuslu',
  regionCount: '{total} bölgeden {shown} tanesi',

  roleSurvivor: 'Hayatta Kalan',
  roleKiller: 'Katil',
  bonusBadge: 'Bonus',

  noBonus: 'Bonus yok',
  noBonusSub: 'Her iki rol için ×1.00',
  survivorBonus: '{mult} hayatta kalan bonusu',
  killerBonus: '{mult} katil bonusu',

  badgeStale: 'Eski',
  badgeNoData: 'Veri yok',
  badgeNoDataYet: 'Henüz veri yok',

  ratio: 'oran {value}',
  autoRefreshing: 'otomatik yenileniyor',

  emptyTitle: 'Eşleşen bölge yok',
  emptyBody: 'Farklı bir arama deneyin ya da tüm bölgeleri görmek için filtreleri temizleyin.',
  clearFilters: 'Filtreleri temizle',
  errorTitle: 'Bir şeyler ters gitti',
  tryAgain: 'Tekrar dene',

  paginationPrev: 'Önceki',
  paginationNext: 'Sonraki',

  statusDegraded: 'Bilinen son değerler gösteriliyor. Bazı bölgeler şu anda güncel veri bildirmiyor.',
  statusPaused: "Canlı sorgulama, API'yi yormamak için yavaşlatılıyor. Değerler her zamankinden daha eski olabilir.",
  statusError: 'Toplayıcı, teşvik hizmetine ulaşamıyor. Önbelleğe en son alınan değerler gösteriliyor.',

  timeNever: 'asla',
  timeUnknown: 'bilinmiyor',
  timeJustNow: 'az önce',
  timeSecondsAgo: '{n}sn önce',
  timeMinutesAgo: '{n}dk önce',
  timeHoursAgo: '{n}sa önce',
  timeDaysAgo: '{n}g önce',

  bannerDisclaimer:
    'Resmi olmayan bir hayran projesidir; Behaviour Interactive ile bağlantılı değildir ve onlar tarafından onaylanmamıştır. Dead by Daylight ve kan puanları (Bloodpoints), Behaviour Interactive şirketinin ticari markalarıdır.',
  bannerNice:
    "Behaviour'dan biriyseniz: lütfen anlayışlı olun. Bu yalnızca (yazıldığı sırada) bir bilgisayar bilimi öğrencisi tarafından geliştirilen bir hayran projesidir ve uygulama API'ye son derece nazik davranır.",
  bannerContact: 'Benimle iletişime geçmeniz gerekirse, bu örneğin iletişim e-postası {email} adresidir.',
  bannerDismiss: 'Anladım',
  footerDisclaimer:
    'Resmi olmayan bir hayran projesidir. Behaviour Interactive ile bağlantılı değildir ve onlar tarafından onaylanmamıştır. Dead by Daylight ve kan puanları (Bloodpoints), Behaviour Interactive şirketinin ticari markalarıdır. Kullanım kendi sorumluluğunuzdadır.',
  footerContact: 'İletişim: {email}',
};

export default tr;
