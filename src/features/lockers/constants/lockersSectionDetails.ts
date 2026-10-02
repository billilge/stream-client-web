import sectionA1Photo from "@/assets/images/lockers/section-a-1-photo.jpg";

// 구역 상세 응답(GET /v1/app/lockers/sections/{sectionId}). layout은 구조만 갖고 칸 상태는 lockers에서
// 온다 — 둘은 lockerNumber로 잇는다.

// "hug"는 내용 크기, "fill"은 부모의 남은 공간, 숫자는 px
export type LockersLayoutSize = "hug" | "fill" | number;

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

// rows[0]이 맨 위 행(위쪽 칸), 숫자는 lockerNumber, null은 빈 자리
export interface LockersLayoutLockerGroupBlock extends LockersLayoutBlockBase {
  type: "lockerGroup";
  rows: (number | null)[][];
  bordered?: boolean;
}

export interface LockersLayoutLabelBlock extends LockersLayoutBlockBase {
  type: "label";
  text: string;
  orientation?: "horizontal" | "vertical";
}

export interface LockersLayoutAreaBlock extends LockersLayoutBlockBase {
  type: "area";
  text: string;
  icon?: "stairs";
}

export interface LockersLayoutTextBlock extends LockersLayoutBlockBase {
  type: "text";
  text: string;
}

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

export interface LockersSectionLocker {
  lockerId: number;
  lockerNumber: number;
  // 관리자가 입력하는 값이라 번호에서 만들지 않는다
  lockerLabel: string;
  isAvailable: boolean;
  isMine: boolean;
}

export interface LockersSectionDetail {
  sectionId: number;
  section: string;
  layout: LockersLayout;
  photoUrl: string;
  lockers: LockersSectionLocker[];
}

// Figma 목업이 전부 선택 가능이라 그대로 두고, 이름은 Figma 표기("A-25")대로 만든다
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

// Figma: A-1구역 (nodeId 2159:110753)
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
  photoUrl: sectionA1Photo,
  section: "A-1",
  sectionId: 1,
};

// Figma: A-2구역 (nodeId 2159:109533)
// A-2 사진이 아직 없어서 A-1 사진을 임시로 쓴다.
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
  photoUrl: sectionA1Photo,
  section: "A-2",
  sectionId: 2,
};

// 주소가 구역 라벨(/lockers/apply/sections/A-1)이라 라벨로 찾는다
export const LOCKERS_SECTION_DETAILS: Record<string, LockersSectionDetail> = {
  "A-1": A1_SECTION,
  "A-2": A2_SECTION,
};
