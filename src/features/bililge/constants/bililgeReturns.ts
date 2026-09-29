import bandAid from "@/assets/icons/bililge-items/band-aid.svg";
import laptopCharger from "@/assets/icons/bililge-items/laptop-charger.svg";
import powerBank from "@/assets/icons/bililge-items/power-bank.svg";
import umbrella from "@/assets/icons/bililge-items/umbrella.svg";

export interface BililgeReturnItem {
  id: string;
  name: string;
  icon: string;
  dueAt: Date;
}

// 디자인 QA 페이지(nodeId 2849:56701 "변경필요")에서 반납 기한 표기를 "반납까지 N시간"에서
// 오늘/내일/그 이후로 구분한 상대 날짜 표기로 바꾸기로 했다 — 오늘이면 "{시}시까지", 내일이면
// "내일까지", 모레(3일째)부터는 "{월}월 {일}일까지"로 날짜를 그대로 보여준다. 시각 비교는
// 시(hour) 단위가 아니라 자정 기준 달력 일수 차이로 계산한다 — 밤 11시에 "28시간 뒤"가
// 실제로는 모레인데 "내일"로 잘못 표시되는 걸 막기 위해서다.
export function formatBililgeReturnDeadline(
  dueAt: Date,
  now: Date = new Date(),
): string {
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.round(
    (startOfDay(dueAt) - startOfDay(now)) / (24 * 60 * 60 * 1000),
  );

  if (dayDiff <= 0) {
    return `${dueAt.getHours()}시까지`;
  }
  if (dayDiff === 1) {
    return "내일까지";
  }
  return `${dueAt.getMonth() + 1}월 ${dueAt.getDate()}일까지`;
}

// Figma 목데이터 기준 시각(오늘/내일)을 실행 시점의 실제 날짜에 맞춰 계산한다 — 날짜를
// 하드코딩하면 시간이 지날수록 "오늘"·"내일" 표기가 어긋난다.
function atDaysFromNow(daysOffset: number, hour: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, 0, 0, 0);
  return date;
}

// Figma: 빌릴게 반납 화면 Return Items Section (nodeId 1133:49979) 목데이터 — 실 API 연동 전까지 사용
export const BILILGE_RETURN_ITEMS: BililgeReturnItem[] = [
  { dueAt: atDaysFromNow(0, 17), icon: umbrella, id: "umbrella", name: "우산" },
  {
    dueAt: atDaysFromNow(1, 12),
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
