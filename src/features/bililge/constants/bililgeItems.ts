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

export interface BililgeItem {
  id: string;
  name: string;
  quantity: number;
  icon: string;
}

// Figma: 빌릴게 Item Grid (nodeId 1243:73343) 순서·물품명·수량을 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용
export const BILILGE_ITEMS: BililgeItem[] = [
  { icon: curlingIron, id: "curling-iron", name: "고데기", quantity: 28 },
  {
    icon: laptopCharger,
    id: "laptop-charger",
    name: "노트북 충전기(C타입)",
    quantity: 28,
  },
  { icon: hairDryer, id: "hair-dryer", name: "드라이기", quantity: 28 },
  { icon: mask, id: "mask", name: "마스크", quantity: 28 },
  { icon: bandAid, id: "band-aid", name: "밴드", quantity: 28 },
  { icon: powerBank, id: "power-bank", name: "보조배터리", quantity: 28 },
  {
    icon: sanitaryPad,
    id: "sanitary-pad-large",
    name: "생리대(대형)",
    quantity: 28,
  },
  {
    icon: sanitaryPad,
    id: "sanitary-pad-small",
    name: "생리대(소형)",
    quantity: 28,
  },
  { icon: alcoholSwab, id: "alcohol-swab", name: "알콜스왑", quantity: 28 },
  { icon: umbrella, id: "umbrella", name: "우산", quantity: 28 },
  { icon: pill, id: "stomach-medicine", name: "위장약", quantity: 28 },
  { icon: pill, id: "easyen-6", name: "이지엔6", quantity: 28 },
  { icon: eyeDrops, id: "eye-drops", name: "인공눈물", quantity: 28 },
  { icon: pill, id: "cold-medicine", name: "종합감기약", quantity: 28 },
  {
    icon: usbCCharger,
    id: "usb-c-cable",
    name: "케이블(C to C)",
    quantity: 28,
  },
  { icon: pill, id: "tylenol", name: "타이레놀", quantity: 28 },
  {
    icon: painReliefPatch,
    id: "pain-relief-patch",
    name: "파스",
    quantity: 28,
  },
  { icon: ointment, id: "ointment", name: "후시딘", quantity: 28 },
  {
    icon: eightPinCharger,
    id: "8pin-charger",
    name: "8핀 충전기",
    quantity: 28,
  },
];
