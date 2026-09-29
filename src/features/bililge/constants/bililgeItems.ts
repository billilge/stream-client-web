import eightPinCharger from "@/assets/icons/bililge-items/8pin-charger.svg";
import alcoholSwab from "@/assets/icons/bililge-items/alcohol-swab.svg";
import bandAid from "@/assets/icons/bililge-items/band-aid.svg";
import curlingIron from "@/assets/icons/bililge-items/curling-iron.svg";
import eyeDrops from "@/assets/icons/bililge-items/eye-drops.svg";
import hairDryer from "@/assets/icons/bililge-items/hair-dryer.svg";
import laptopCharger from "@/assets/icons/bililge-items/laptop-charger.svg";
import mask from "@/assets/icons/bililge-items/mask.svg";
import ointment from "@/assets/icons/bililge-items/ointment.svg";
import painReliefPatch from "@/assets/icons/bililge-items/pain-relief-patch.svg";
import pill from "@/assets/icons/bililge-items/pill.svg";
import powerBank from "@/assets/icons/bililge-items/power-bank.svg";
import sanitaryPad from "@/assets/icons/bililge-items/sanitary-pad.svg";
import umbrella from "@/assets/icons/bililge-items/umbrella.svg";
import usbCCharger from "@/assets/icons/bililge-items/usb-c-charger.svg";

// BililgeCategoryFilter의 필터 칩과 값을 맞춘다("전체"는 필터 없음을 뜻하는 값이라 제외).
export type BililgeCategory = "전자기기" | "생활잡화" | "상비약" | "위생용품";

export interface BililgeItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
  category: BililgeCategory;
}

// Figma: 빌릴게 Item Grid (nodeId 1243:73343) 순서·물품명·수량을 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
// category는 Figma에 카테고리별 그룹핑이 따로 없어(칩 자체만 정의돼 있음) 물품명 기준으로 임의
// 분류했다 — 실제 분류 기준이 정해지면 API 연동 시 교체한다.
export const BILILGE_ITEMS: BililgeItem[] = [
  {
    category: "전자기기",
    icon: curlingIron,
    id: "curling-iron",
    name: "고데기",
    quantity: 28,
  },
  {
    category: "전자기기",
    icon: laptopCharger,
    id: "laptop-charger",
    name: "노트북 충전기(C타입)",
    quantity: 28,
  },
  {
    category: "전자기기",
    icon: hairDryer,
    id: "hair-dryer",
    name: "드라이기",
    quantity: 28,
  },
  {
    category: "위생용품",
    icon: mask,
    id: "mask",
    name: "마스크",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: bandAid,
    id: "band-aid",
    name: "밴드",
    quantity: 28,
  },
  {
    category: "전자기기",
    icon: powerBank,
    id: "power-bank",
    name: "보조배터리",
    quantity: 28,
  },
  {
    category: "위생용품",
    icon: sanitaryPad,
    id: "sanitary-pad-large",
    name: "생리대(대형)",
    quantity: 28,
  },
  {
    category: "위생용품",
    icon: sanitaryPad,
    id: "sanitary-pad-small",
    name: "생리대(소형)",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: alcoholSwab,
    id: "alcohol-swab",
    name: "알콜스왑",
    quantity: 28,
  },
  {
    category: "생활잡화",
    icon: umbrella,
    id: "umbrella",
    name: "우산",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: pill,
    id: "stomach-medicine",
    name: "위장약",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: pill,
    id: "easyen-6",
    name: "이지엔6",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: eyeDrops,
    id: "eye-drops",
    name: "인공눈물",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: pill,
    id: "cold-medicine",
    name: "종합감기약",
    quantity: 28,
  },
  {
    category: "전자기기",
    icon: usbCCharger,
    id: "usb-c-cable",
    name: "케이블(C to C)",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: pill,
    id: "tylenol",
    name: "타이레놀",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: painReliefPatch,
    id: "pain-relief-patch",
    name: "파스",
    quantity: 28,
  },
  {
    category: "상비약",
    icon: ointment,
    id: "ointment",
    name: "후시딘",
    quantity: 28,
  },
  {
    category: "전자기기",
    icon: eightPinCharger,
    id: "8pin-charger",
    name: "8핀 충전기",
    quantity: 28,
  },
];
