export interface LockersLocker {
  number: number;
  isAvailable: boolean;
}

// 칸 묶음 하나(Figma "Zone Area" 안의 "Locker Grid"). 행 단위로 적는다 — 번호가 행마다
// 이어지지 않는 묶음이 있어서(A-1 가운데 묶음은 25~30 / 22~24·31~33 / 19~21·34~36) 규칙으로 만들지 않는다.
export type LockersLockerGroup = LockersLocker[][];

function toRows(rows: number[][]): LockersLockerGroup {
  return rows.map((row) =>
    row.map((number) => ({ isAvailable: true, number })),
  );
}

// Figma: A-1구역 Locker Grid Area (nodeId 2159:110825) — 왼쪽 벽면 · 창문 · 오른쪽 벽면 순서.
// Figma 목업은 전부 선택 가능이라 목데이터도 그렇게 둔다. API가 붙으면 isAvailable만 채우면 된다.
export const LOCKERS_A1_GROUPS = {
  left: toRows([
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18],
  ]),
  middle: toRows([
    [25, 26, 27, 28, 29, 30],
    [22, 23, 24, 31, 32, 33],
    [19, 20, 21, 34, 35, 36],
  ]),
  right: toRows([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
} as const satisfies Record<string, LockersLockerGroup>;

// Figma: A-2구역 Locker Grid (nodeId 2159:109626)
export const LOCKERS_A2_GROUP: LockersLockerGroup = toRows([
  [82, 83, 84],
  [85, 86, 87],
  [88, 89, 90],
]);

// 사진 속 칸 번호 핀 색. 위쪽 칸일수록 진하다(Figma Orange/50 → 70 → 90).
export type LockersPhotoPinTone = "upper" | "middle" | "lower";

export interface LockersPhotoPin {
  number: number;
  tone: LockersPhotoPinTone;
  /** 사진 프레임(300×224) 기준 좌표(px) */
  left: number;
  top: number;
}

// Figma 가운데 묶음 핀은 "Photo Annotation"(left 94.14 · top 89.83) 안에서 flex로 놓여 있다.
// 핀 12.414px + 가로 간격 7px · 세로 간격 12px을 풀어서 좌표로 적는다.
const MIDDLE_PIN_LEFTS = [94.14, 113.55, 132.97, 152.38, 171.8, 191.21];
const MIDDLE_PIN_ROWS: [LockersPhotoPinTone, number, number[]][] = [
  ["upper", 89.83, [25, 26, 27, 28, 29, 30]],
  ["middle", 114.24, [22, 23, 24, 31, 32, 33]],
  ["lower", 138.66, [19, 20, 21, 34, 35, 36]],
];

// Figma: A-1구역 실제사진 Modal (nodeId 2159:110299) 안의 핀 좌표
export const LOCKERS_A1_PHOTO_PINS: LockersPhotoPin[] = [
  { left: 9.5, number: 10, tone: "upper", top: 94.14 },
  { left: 39.5, number: 11, tone: "upper", top: 88.45 },
  { left: 61.5, number: 12, tone: "upper", top: 84.31 },
  { left: 9.5, number: 13, tone: "middle", top: 141.72 },
  { left: 39.5, number: 14, tone: "middle", top: 129.31 },
  { left: 61.5, number: 15, tone: "middle", top: 118.97 },
  { left: 9.5, number: 16, tone: "lower", top: 192.93 },
  { left: 39.5, number: 17, tone: "lower", top: 169.65 },
  { left: 61.5, number: 18, tone: "lower", top: 152.07 },
  ...MIDDLE_PIN_ROWS.flatMap(([tone, top, numbers]) =>
    numbers.map((number, index) => ({
      left: MIDDLE_PIN_LEFTS[index],
      number,
      tone,
      top,
    })),
  ),
  { left: 226.5, number: 1, tone: "upper", top: 83.28 },
  { left: 251.5, number: 2, tone: "upper", top: 85.86 },
  { left: 283.5, number: 3, tone: "upper", top: 89.48 },
  { left: 226.5, number: 4, tone: "middle", top: 118.97 },
  { left: 251.5, number: 5, tone: "middle", top: 131.9 },
  { left: 283.5, number: 6, tone: "middle", top: 149.48 },
  { left: 226.5, number: 7, tone: "lower", top: 149.48 },
  { left: 251.5, number: 8, tone: "lower", top: 171.21 },
  { left: 283.5, number: 9, tone: "lower", top: 193.97 },
];
