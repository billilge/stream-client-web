// 구역 혼잡도. Figma 목업의 잔여 수량과 뱃지가 서로 맞물리지 않아서(6/6·12/12이 "여유"인데
// 24/60은 "보통", 24/40은 "마감 임박") 잔여 비율에서 유도하지 않고 데이터로 받는다.
// 임계값 규칙이 정해지면 그때 유도로 바꾼다.
export type LockersSectionStatus =
  | "spacious"
  | "normal"
  | "almostFull"
  | "full";

export interface LockersSection {
  id: string;
  name: string;
  status: LockersSectionStatus;
  remaining: number;
  total: number;
}

// Figma: 사물함 구역 선택 전 Floor Map (nodeId 1737:218457)의 구역을 그대로 옮긴 목데이터.
// 평면도 배치(231/232호실·화장실·계단·복도)는 데이터가 아니라 LockersFloorMap의 레이아웃이 갖는다.
export const LOCKERS_LEFT_SECTIONS: LockersSection[] = [
  { id: "A-1", name: "A-1", remaining: 24, status: "spacious", total: 34 },
];

export const LOCKERS_RIGHT_SECTIONS: LockersSection[] = [
  { id: "A-2", name: "A-2", remaining: 6, status: "spacious", total: 6 },
  { id: "B-1", name: "B-1", remaining: 24, status: "normal", total: 60 },
  { id: "B-2", name: "B-2", remaining: 24, status: "almostFull", total: 40 },
  { id: "C", name: "C", remaining: 0, status: "full", total: 100 },
  { id: "D", name: "D", remaining: 24, status: "spacious", total: 30 },
  { id: "A-3", name: "A-3", remaining: 12, status: "spacious", total: 12 },
];

// 계단 아래에 따로 놓이는 구역 — 평면도상 위치가 달라서 배열을 나눠 둔다.
export const LOCKERS_RIGHT_SECTIONS_BELOW_STAIRS: LockersSection[] = [
  { id: "A-4", name: "A-4", remaining: 24, status: "spacious", total: 26 },
];
