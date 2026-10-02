// 사진 위 칸 번호 핀. 서버는 사진 주소만 주고, 핀 좌표는 구역별로 여기서 관리한다 — 사진을 바꾸면 같이 고친다.
// x·y는 핀 가운데 위치를 사진 폭·높이 대비 0~1 비율로 적는다.
export interface LockersSectionPhotoPin {
  lockerNumber: number;
  x: number;
  y: number;
}

// Figma: A-1구역 실제사진 (nodeId 2159:110299)
// Figma는 사진을 1.12° 돌려 붙였는데 회전은 무시하고 비율로 옮겼다(가장자리에서 2~3px 차이).
const A1_PINS: LockersSectionPhotoPin[] = [
  { lockerNumber: 1, x: 0.758, y: 0.392 },
  { lockerNumber: 2, x: 0.836, y: 0.403 },
  { lockerNumber: 3, x: 0.936, y: 0.418 },
  { lockerNumber: 4, x: 0.758, y: 0.54 },
  { lockerNumber: 5, x: 0.836, y: 0.594 },
  { lockerNumber: 6, x: 0.936, y: 0.667 },
  { lockerNumber: 7, x: 0.758, y: 0.667 },
  { lockerNumber: 8, x: 0.836, y: 0.758 },
  { lockerNumber: 9, x: 0.936, y: 0.852 },
  { lockerNumber: 10, x: 0.081, y: 0.437 },
  { lockerNumber: 11, x: 0.175, y: 0.413 },
  { lockerNumber: 12, x: 0.243, y: 0.396 },
  { lockerNumber: 13, x: 0.081, y: 0.635 },
  { lockerNumber: 14, x: 0.175, y: 0.583 },
  { lockerNumber: 15, x: 0.243, y: 0.54 },
  { lockerNumber: 16, x: 0.081, y: 0.848 },
  { lockerNumber: 17, x: 0.175, y: 0.751 },
  { lockerNumber: 18, x: 0.243, y: 0.678 },
  { lockerNumber: 19, x: 0.345, y: 0.622 },
  { lockerNumber: 20, x: 0.406, y: 0.622 },
  { lockerNumber: 21, x: 0.466, y: 0.622 },
  { lockerNumber: 22, x: 0.345, y: 0.521 },
  { lockerNumber: 23, x: 0.406, y: 0.521 },
  { lockerNumber: 24, x: 0.466, y: 0.521 },
  { lockerNumber: 25, x: 0.345, y: 0.419 },
  { lockerNumber: 26, x: 0.406, y: 0.419 },
  { lockerNumber: 27, x: 0.466, y: 0.419 },
  { lockerNumber: 28, x: 0.527, y: 0.419 },
  { lockerNumber: 29, x: 0.588, y: 0.419 },
  { lockerNumber: 30, x: 0.648, y: 0.419 },
  { lockerNumber: 31, x: 0.527, y: 0.521 },
  { lockerNumber: 32, x: 0.588, y: 0.521 },
  { lockerNumber: 33, x: 0.648, y: 0.521 },
  { lockerNumber: 34, x: 0.527, y: 0.622 },
  { lockerNumber: 35, x: 0.588, y: 0.622 },
  { lockerNumber: 36, x: 0.648, y: 0.622 },
];

// 구역 라벨로 찾는다. A-2는 사진이 아직 없어서(A-1 사진 임시 사용) 핀이 없다.
export const LOCKERS_SECTION_PHOTO_PINS: Record<
  string,
  LockersSectionPhotoPin[]
> = {
  "A-1": A1_PINS,
};
