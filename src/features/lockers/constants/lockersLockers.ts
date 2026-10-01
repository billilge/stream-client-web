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
