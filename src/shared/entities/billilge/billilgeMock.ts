import eightPinCharger from "@/assets/icons/billilge-items/8pin-charger.svg";
import alcoholSwab from "@/assets/icons/billilge-items/alcohol-swab.svg";
import bandAid from "@/assets/icons/billilge-items/band-aid.svg";
import curlingIron from "@/assets/icons/billilge-items/curling-iron.svg";
import eyeDrops from "@/assets/icons/billilge-items/eye-drops.svg";
import hairDryer from "@/assets/icons/billilge-items/hair-dryer.svg";
import laptopCharger from "@/assets/icons/billilge-items/laptop-charger.svg";
import mask from "@/assets/icons/billilge-items/mask.svg";
import ointment from "@/assets/icons/billilge-items/ointment.svg";
import painReliefPatch from "@/assets/icons/billilge-items/pain-relief-patch.svg";
import pill from "@/assets/icons/billilge-items/pill.svg";
import powerBank from "@/assets/icons/billilge-items/power-bank.svg";
import sanitaryPad from "@/assets/icons/billilge-items/sanitary-pad.svg";
import umbrella from "@/assets/icons/billilge-items/umbrella.svg";
import usbCCharger from "@/assets/icons/billilge-items/usb-c-charger.svg";
import type {
  BillilgeCategory,
  BillilgeItem,
} from "@/shared/entities/billilge/billilgeTypes";

// 서버(ItemListItemResponse)가 반납 정책으로 만드는 반납 기한 문구를 흉내낸다 — 0일이면 당일 마감 시각까지,
// 1일이면 "내일", 그 밖은 날짜(M/d). 마감 시각은 서버가 17시로 고정한다.
function mockReturnDeadlineLabel(maxRentalDays: number): string {
  if (maxRentalDays === 0) {
    return "오늘 17시까지 반납";
  }
  if (maxRentalDays === 1) {
    return "내일까지 반납";
  }
  const date = new Date();
  date.setDate(date.getDate() + maxRentalDays);
  return `${date.getMonth() + 1}/${date.getDate()}까지 반납`;
}

// 대여품은 반납 정책(빌릴 수 있는 날 수)이 있고, 소모품(maxRentalDays null)은 반납 정책·문구가 없다
function mockItem(
  itemId: number,
  name: string,
  category: BillilgeCategory,
  imageUrl: string,
  maxRentalDays: number | null,
  count = 28,
): BillilgeItem {
  const isRental = maxRentalDays !== null;
  return {
    category,
    count,
    imageUrl,
    itemId,
    name,
    returnDeadlineLabel: isRental
      ? mockReturnDeadlineLabel(maxRentalDays)
      : null,
    returnPolicy: isRental ? { maxRentalDays, returnDeadline: "17:00" } : null,
    type: isRental ? "RENTAL" : "CONSUMABLE",
  };
}

// Figma: 빌릴게 Item Grid (nodeId 1243:73343) 순서·물품명·수량을 그대로 옮긴 목데이터 — 대여 탭 목록(물품 목록
// API를 붙이기 전까지)과 통합 검색(검색 API가 붙으면 지운다)이 쓴다. 분류·대여품 여부는 Figma에 없어 물품명 기준으로 정했다.
export const BILLILGE_ITEMS: BillilgeItem[] = [
  mockItem(1, "고데기", "ELECTRONICS", curlingIron, 0),
  mockItem(2, "노트북 충전기(C타입)", "ELECTRONICS", laptopCharger, 1),
  mockItem(3, "드라이기", "ELECTRONICS", hairDryer, 0),
  mockItem(4, "마스크", "HYGIENE", mask, null),
  mockItem(5, "밴드", "MEDICINE", bandAid, null),
  mockItem(6, "보조배터리", "ELECTRONICS", powerBank, 1),
  mockItem(7, "생리대(대형)", "HYGIENE", sanitaryPad, null),
  mockItem(8, "생리대(소형)", "HYGIENE", sanitaryPad, null),
  mockItem(9, "알콜스왑", "MEDICINE", alcoholSwab, null),
  // 품절 카드(Figma 1453:115350)를 볼 수 있게 우산만 재고를 0으로 둔다
  mockItem(10, "우산", "DAILY_SUPPLIES", umbrella, 2, 0),
  mockItem(11, "위장약", "MEDICINE", pill, null),
  mockItem(12, "이지엔6", "MEDICINE", pill, null),
  mockItem(13, "인공눈물", "MEDICINE", eyeDrops, null),
  mockItem(14, "종합감기약", "MEDICINE", pill, null),
  mockItem(15, "케이블(C to C)", "ELECTRONICS", usbCCharger, 0),
  mockItem(16, "타이레놀", "MEDICINE", pill, null),
  mockItem(17, "파스", "MEDICINE", painReliefPatch, null),
  mockItem(18, "후시딘", "MEDICINE", ointment, null),
  mockItem(19, "8핀 충전기", "ELECTRONICS", eightPinCharger, 0),
];
