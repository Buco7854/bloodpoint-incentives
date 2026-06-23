import type { Messages } from '../types';

const ko: Messages = {
  title: '블러드포인트 인센티브',
  subtitle: '매치메이킹 지역별로, 인원이 부족한 역할을 플레이할 때 주어지는 실시간 보너스입니다.',
  refreshAria: '캐시에서 새로고침',
  updatedAgo: '{time} 업데이트됨',
  language: '언어',

  searchPlaceholder: '지역 검색...',
  searchAria: '지역 검색',
  sort: '정렬',
  sortName: '이름',
  sortBonus: '보너스',
  filterAll: '전체',
  filterSurvivor: '생존자',
  filterKiller: '살인마',
  filterBonus: '보너스 있음',
  regionCount: '{total}개 지역 중 {shown}개',

  roleSurvivor: '생존자',
  roleKiller: '살인마',
  bonusBadge: '보너스',

  noBonus: '보너스 없음',
  noBonusSub: '두 역할 모두 ×1.00',
  survivorBonus: '생존자 보너스 {mult}',
  killerBonus: '살인마 보너스 {mult}',

  badgeStale: '오래됨',
  badgeNoData: '데이터 없음',
  badgeNoDataYet: '아직 데이터 없음',

  ratio: '비율 {value}',
  autoRefreshing: '자동 새로고침 중',

  emptyTitle: '일치하는 지역이 없습니다',
  emptyBody: '다른 검색어를 사용하거나 필터를 초기화하여 모든 지역을 확인하세요.',
  clearFilters: '필터 초기화',
  errorTitle: '문제가 발생했습니다',
  tryAgain: '다시 시도',

  paginationPrev: '이전',
  paginationNext: '다음',

  statusDegraded: '마지막으로 확인된 값을 표시하고 있습니다. 일부 지역은 현재 최신 데이터를 전송하지 않고 있습니다.',
  statusPaused: 'API에 부담을 주지 않도록 실시간 폴링 속도를 낮추고 있습니다. 값이 평소보다 오래되었을 수 있습니다.',
  statusError: '폴러가 인센티브 서비스에 연결할 수 없습니다. 마지막으로 캐시된 값을 표시합니다.',

  timeNever: '없음',
  timeUnknown: '알 수 없음',
  timeJustNow: '방금 전',
  timeSecondsAgo: '{n}초 전',
  timeMinutesAgo: '{n}분 전',
  timeHoursAgo: '{n}시간 전',
  timeDaysAgo: '{n}일 전',

  bannerDisclaimer:
    '비공식 팬 프로젝트이며 Behaviour Interactive와 제휴하거나 승인받지 않았습니다. Dead by Daylight 및 블러드포인트(Bloodpoints)는 Behaviour Interactive의 상표입니다.',
  bannerNice:
    'Behaviour 직원분이라면 너그럽게 봐주세요. 이것은 (작성 시점 기준) 컴퓨터공학 전공 학생이 만든 팬 프로젝트일 뿐이며, 이 앱은 API에 매우 적은 부하만 줍니다.',
  bannerContact: '저에게 연락이 필요하시면, 이 인스턴스의 문의 이메일은 {email} 입니다.',
  bannerDismiss: '확인',
  footerDisclaimer:
    '비공식 팬 프로젝트입니다. Behaviour Interactive와 제휴하거나 승인받지 않았습니다. Dead by Daylight 및 블러드포인트(Bloodpoints)는 Behaviour Interactive의 상표입니다. 사용에 따른 책임은 본인에게 있습니다.',
  footerContact: '문의: {email}',
};

export default ko;
