import sectionA1Photo from "@/assets/images/lockers/section-a-1-photo.jpg";

// 구역 상세 응답(GET /v1/app/lockers/sections/{sectionId})의 형태.
// 칸 배치(layout)는 구조만 갖고, 칸 상태(선택 가능·내 사물함)는 lockers에서 온다 — 둘은 lockerNumber로 잇는다.

// "hug"는 내용 크기, "fill"은 부모의 남은 공간 채우기, 숫자는 px 고정.
export type LockersLayoutSize = "hug" | "fill" | number;

// row·column의 교차축 정렬
export type LockersLayoutAlign = "start" | "center" | "end" | "stretch";

interface LockersLayoutBlockBase {
  width?: LockersLayoutSize;
  height?: LockersLayoutSize;
}

export interface LockersLayoutContainerBlock extends LockersLayoutBlockBase {
  type: "row" | "column";
  children: LockersLayoutBlock[];
  gap?: number;
  align?: LockersLayoutAlign;
}

// 칸 묶음(Figma Zone Area + Locker Grid). rows[0]이 맨 위 행(위쪽 칸), 숫자는 lockerNumber,
// null은 칸이 없는 빈 자리다. bordered면 테두리 상자로 감싼다(A-1·B-2).
export interface LockersLayoutLockerGroupBlock extends LockersLayoutBlockBase {
  type: "lockerGroup";
  rows: (number | null)[][];
  bordered?: boolean;
}

// 회색 면 라벨(Figma Direction Label·Aisle). 창문은 가로, 벽면은 세로로 한 글자씩 줄을 바꾼다.
export interface LockersLayoutLabelBlock extends LockersLayoutBlockBase {
  type: "label";
  text: string;
  orientation?: "horizontal" | "vertical";
}

// 점선 상자(Figma Zone Label·Room Label·Stairs Area) — 옆 구역, 호실, 계단
export interface LockersLayoutAreaBlock extends LockersLayoutBlockBase {
  type: "area";
  text: string;
  icon?: "stairs";
}

// 테두리 없는 글자(Figma 복도)
export interface LockersLayoutTextBlock extends LockersLayoutBlockBase {
  type: "text";
  text: string;
}

// 위쪽 칸 / 아래쪽 칸 표시(Figma Shelf Label)
export interface LockersLayoutShelfLabelBlock extends LockersLayoutBlockBase {
  type: "shelfLabel";
}

export type LockersLayoutBlock =
  | LockersLayoutContainerBlock
  | LockersLayoutLockerGroupBlock
  | LockersLayoutLabelBlock
  | LockersLayoutAreaBlock
  | LockersLayoutTextBlock
  | LockersLayoutShelfLabelBlock;

export interface LockersLayout {
  version: 1;
  root: LockersLayoutBlock;
}

// 사진 위 칸 번호 핀. x·y는 핀 가운데의 위치를 사진 폭·높이 대비 0~1 비율로 적는다.
export interface LockersSectionPhotoPin {
  lockerNumber: number;
  x: number;
  y: number;
}

export interface LockersSectionPhoto {
  url: string;
  pins: LockersSectionPhotoPin[];
}

export interface LockersSectionLocker {
  lockerId: number;
  lockerNumber: number;
  // 화면에 그대로 보여주는 이름("A-25"). 관리자가 입력하는 값이라 번호에서 만들지 않는다.
  lockerLabel: string;
  isAvailable: boolean;
  isMine: boolean;
}

export interface LockersSectionDetail {
  sectionId: number;
  section: string;
  layout: LockersLayout;
  photo: LockersSectionPhoto;
  lockers: LockersSectionLocker[];
}

// 목데이터용 — 실제로는 서버가 lockers를 내려준다. Figma 목업이 전부 선택 가능이라 그대로 둔다.
// 이름은 서버가 관리자 입력값으로 주지만, 목데이터는 Figma 표기("A-25", 동 이름 + 번호)대로 만든다.
function createMockLockers(
  building: string,
  lockerNumbers: number[],
): LockersSectionLocker[] {
  return lockerNumbers.map((lockerNumber) => ({
    isAvailable: true,
    isMine: false,
    lockerId: lockerNumber,
    lockerLabel: `${building}-${lockerNumber}`,
    lockerNumber,
  }));
}

function range(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

// Figma: A-1구역 (nodeId 2159:110753) — 창문을 사이에 두고 벽면 세 곳에 테두리 묶음이 붙어 있다.
// 핀은 A-1구역 실제사진(2159:110299)의 좌표를 사진 원본 대비 비율로 옮겼다. Figma는 사진을
// 1.12° 돌려 붙였는데 서버는 잘라 둔 사진을 줄 거라 회전은 무시했다(가장자리에서 2~3px 차이).
const A1_SECTION: LockersSectionDetail = {
  layout: {
    root: {
      align: "end",
      children: [
        {
          align: "end",
          children: [
            { height: 122, type: "shelfLabel" },
            {
              align: "center",
              children: [
                { text: "창문", type: "label", width: 224 },
                {
                  children: [
                    {
                      height: "fill",
                      orientation: "vertical",
                      text: "왼쪽 벽면",
                      type: "label",
                    },
                    {
                      bordered: true,
                      rows: [
                        [10, 11, 12],
                        [13, 14, 15],
                        [16, 17, 18],
                      ],
                      type: "lockerGroup",
                    },
                    {
                      bordered: true,
                      rows: [
                        [25, 26, 27, 28, 29, 30],
                        [22, 23, 24, 31, 32, 33],
                        [19, 20, 21, 34, 35, 36],
                      ],
                      type: "lockerGroup",
                    },
                    {
                      bordered: true,
                      rows: [
                        [1, 2, 3],
                        [4, 5, 6],
                        [7, 8, 9],
                      ],
                      type: "lockerGroup",
                    },
                    {
                      height: "fill",
                      orientation: "vertical",
                      text: "오른쪽 벽면",
                      type: "label",
                    },
                  ],
                  gap: 12,
                  type: "row",
                },
              ],
              gap: 8,
              type: "column",
            },
          ],
          gap: 12,
          type: "row",
        },
        { text: "복도", type: "text", width: 560 },
      ],
      gap: 32,
      type: "column",
    },
    version: 1,
  },
  lockers: createMockLockers("A", range(1, 36)),
  photo: {
    pins: [
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
    ],
    url: sectionA1Photo,
  },
  section: "A-1",
  sectionId: 1,
};

// Figma: A-2구역 (nodeId 2159:109533) — 칸 묶음 옆이 B-1구역, 복도 건너편이 231호실이다.
// A-2 실제 사진은 아직 없어서(직접 찍을 예정) A-1 사진을 임시로 쓰고, 번호가 맞지 않으니 핀은 비워 둔다.
const A2_SECTION: LockersSectionDetail = {
  layout: {
    root: {
      children: [
        { height: 96, type: "shelfLabel" },
        {
          align: "center",
          children: [
            {
              children: [
                {
                  rows: [
                    [82, 83, 84],
                    [85, 86, 87],
                    [88, 89, 90],
                  ],
                  type: "lockerGroup",
                },
                {
                  height: "fill",
                  text: "B-1구역",
                  type: "area",
                  width: "fill",
                },
              ],
              gap: 12,
              type: "row",
              width: "fill",
            },
            { text: "복도", type: "text" },
            { text: "231호실", type: "area", width: "fill" },
          ],
          gap: 32,
          type: "column",
          width: "fill",
        },
      ],
      gap: 12,
      type: "row",
    },
    version: 1,
  },
  lockers: createMockLockers("A", range(82, 90)),
  photo: { pins: [], url: sectionA1Photo },
  section: "A-2",
  sectionId: 2,
};

// API 연동 전까지 쓰는 구역 상세 목데이터. 지금 주소가 구역 라벨(/lockers/apply/sections/A-1)이라
// 라벨로 찾는다. 나머지 구역은 서버 시드가 들어오면 응답으로 대체된다.
export const LOCKERS_SECTION_DETAILS: Record<string, LockersSectionDetail> = {
  "A-1": A1_SECTION,
  "A-2": A2_SECTION,
};
