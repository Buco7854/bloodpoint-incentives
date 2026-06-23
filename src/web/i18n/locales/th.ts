import type { Messages } from '../types';

const th: Messages = {
  title: 'โบนัสแต้มเลือด',
  subtitle: 'โบนัสแบบเรียลไทม์ที่มอบให้เมื่อเล่นบทบาทที่มีผู้เล่นน้อยกว่า แยกตามภูมิภาคการจับคู่',
  refreshAria: 'รีเฟรชจากแคช',
  updatedAgo: 'อัปเดตเมื่อ {time}',
  language: 'ภาษา',

  searchPlaceholder: 'ค้นหาภูมิภาค...',
  searchAria: 'ค้นหาภูมิภาค',
  sort: 'จัดเรียง',
  sortName: 'ชื่อ',
  sortBonus: 'โบนัส',
  filterAll: 'ทั้งหมด',
  filterSurvivor: 'ผู้รอดชีวิต',
  filterKiller: 'ฆาตกร',
  filterBonus: 'มีโบนัส',
  regionCount: '{shown} จาก {total} ภูมิภาค',

  roleSurvivor: 'ผู้รอดชีวิต',
  roleKiller: 'ฆาตกร',
  bonusBadge: 'โบนัส',

  noBonus: 'ไม่มีโบนัส',
  noBonusSub: '×1.00 สำหรับทั้งสองบทบาท',
  survivorBonus: 'โบนัสผู้รอดชีวิต {mult}',
  killerBonus: 'โบนัสฆาตกร {mult}',

  badgeStale: 'ข้อมูลเก่า',
  badgeNoData: 'ไม่มีข้อมูล',
  badgeNoDataYet: 'ยังไม่มีข้อมูล',

  ratio: 'อัตราส่วน {value}',
  autoRefreshing: 'กำลังรีเฟรชอัตโนมัติ',

  emptyTitle: 'ไม่มีภูมิภาคที่ตรงกัน',
  emptyBody: 'ลองค้นหาด้วยคำอื่น หรือล้างตัวกรองเพื่อดูทุกภูมิภาค',
  clearFilters: 'ล้างตัวกรอง',
  errorTitle: 'เกิดข้อผิดพลาดบางอย่าง',
  tryAgain: 'ลองอีกครั้ง',

  paginationPrev: 'ก่อนหน้า',
  paginationNext: 'ถัดไป',

  statusDegraded: 'กำลังแสดงค่าล่าสุดที่ทราบ บางภูมิภาคยังไม่ได้รายงานข้อมูลใหม่ในขณะนี้',
  statusPaused: 'การดึงข้อมูลแบบเรียลไทม์กำลังชะลอลงเพื่อไม่ให้เป็นภาระต่อ API ค่าที่แสดงอาจเก่ากว่าปกติ',
  statusError: 'ตัวดึงข้อมูลไม่สามารถเชื่อมต่อกับบริการโบนัสได้ กำลังแสดงข้อมูลล่าสุดที่แคชไว้',

  timeNever: 'ไม่เคย',
  timeUnknown: 'ไม่ทราบ',
  timeJustNow: 'เมื่อสักครู่',
  timeSecondsAgo: '{n} วินาทีที่แล้ว',
  timeMinutesAgo: '{n} นาทีที่แล้ว',
  timeHoursAgo: '{n} ชั่วโมงที่แล้ว',
  timeDaysAgo: '{n} วันที่แล้ว',

  bannerDisclaimer:
    'โปรเจกต์ของแฟนที่ไม่เป็นทางการ ไม่ได้มีส่วนเกี่ยวข้องหรือได้รับการรับรองจาก Behaviour Interactive Dead by Daylight และแต้มเลือด (Bloodpoints) เป็นเครื่องหมายการค้าของ Behaviour Interactive',
  bannerNice:
    'หากคุณมาจาก Behaviour โปรดเมตตาด้วยนะครับ นี่เป็นเพียงโปรเจกต์ของแฟน ที่พัฒนาโดยนักศึกษาวิทยาการคอมพิวเตอร์ (ในขณะที่เขียนนี้) และแอปนี้ใช้งาน API อย่างเบามือเป็นอย่างยิ่ง',
  bannerContact: 'หากคุณต้องการติดต่อผม อีเมลติดต่อของอินสแตนซ์นี้คือ {email}',
  bannerDismiss: 'เข้าใจแล้ว',
  footerDisclaimer:
    'โปรเจกต์ของแฟนที่ไม่เป็นทางการ ไม่ได้มีส่วนเกี่ยวข้องหรือได้รับการรับรองจาก Behaviour Interactive Dead by Daylight และแต้มเลือด (Bloodpoints) เป็นเครื่องหมายการค้าของ Behaviour Interactive ใช้งานโดยยอมรับความเสี่ยงด้วยตนเอง',
  footerContact: 'ติดต่อ: {email}',
};

export default th;
