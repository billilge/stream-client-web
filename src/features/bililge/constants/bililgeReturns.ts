import bandAid from "@/assets/icons/bililge-items/band-aid.svg";
import laptopCharger from "@/assets/icons/bililge-items/laptop-charger.svg";
import powerBank from "@/assets/icons/bililge-items/power-bank.svg";
import umbrella from "@/assets/icons/bililge-items/umbrella.svg";

export interface BililgeReturnItem {
  id: string;
  name: string;
  icon: string;
  hoursUntilDue: number;
}

// Figma: 빌릴게 반납 화면 Return Items Section (nodeId 1133:49979) 목데이터 — 실 API 연동 전까지 사용
export const BILILGE_RETURN_ITEMS: BililgeReturnItem[] = [
  { hoursUntilDue: 22, icon: umbrella, id: "umbrella", name: "우산" },
  {
    hoursUntilDue: 4,
    icon: laptopCharger,
    id: "laptop-charger",
    name: "노트북 충전기",
  },
];

export interface BililgeRentalHistoryEntry {
  id: string;
  name: string;
  icon: string;
  rentedAt: string;
  returnedAt: string;
}

// Figma: 빌릴게 반납 화면 Rental History Section (nodeId 1133:49983) 목데이터 — 실 API 연동 전까지 사용
export const BILILGE_RENTAL_HISTORY: BililgeRentalHistoryEntry[] = [
  {
    icon: powerBank,
    id: "power-bank-1",
    name: "보조배터리",
    rentedAt: "2025.05.05 11:49",
    returnedAt: "2025.05.05 11:49",
  },
  {
    icon: bandAid,
    id: "band-aid-1",
    name: "밴드",
    rentedAt: "2025.05.05 11:49",
    returnedAt: "2025.05.05 11:49",
  },
  {
    icon: powerBank,
    id: "power-bank-2",
    name: "보조배터리",
    rentedAt: "2025.05.05 11:49",
    returnedAt: "2025.05.05 11:49",
  },
];
