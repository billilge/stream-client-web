import type {
  LockerAvailabilityStatus,
  LockerSectionListResponse,
} from "@/shared/entities/lockers/lockersTypes";

// 구역 혼잡도. Figma 목업의 잔여 수량과 뱃지가 서로 맞물리지 않아서 잔여 비율에서 유도하지 않고
// 서버가 판정한 값(availabilityStatus)을 그대로 쓴다.
export type LockersSectionStatus =
  | "spacious"
  | "normal"
  | "almostFull"
  | "full";

export interface LockersSection {
  sectionId: number;
  name: string;
  status: LockersSectionStatus;
  remaining: number;
  total: number;
}

// 평면도 자리. 호실·계단 사이 어디에 놓이는지는 실제 건물 구조라 LockersFloorMap 레이아웃이 갖고,
// 서버 구역은 이 이름으로 찾아 넣는다. 서버에 없는 자리는 고를 수 없게 그린다.
export const LOCKERS_LEFT_SECTION_NAMES = ["A-1"];
export const LOCKERS_RIGHT_SECTION_NAMES = [
  "A-2",
  "B-1",
  "B-2",
  "C",
  "D",
  "A-3",
];
// 계단 아래에 따로 놓이는 구역
export const LOCKERS_RIGHT_SECTION_NAMES_BELOW_STAIRS = ["A-4"];

const SECTION_STATUSES = {
  ALMOST_FULL: "almostFull",
  FULL: "full",
  NORMAL: "normal",
  PLENTY: "spacious",
} as const satisfies Record<LockerAvailabilityStatus, LockersSectionStatus>;

export function toLockersSections(
  response: LockerSectionListResponse,
): Map<string, LockersSection> {
  return new Map(
    response.sections.map((section) => [
      section.section,
      {
        name: section.section,
        remaining: section.availableCount,
        sectionId: section.sectionId,
        status: SECTION_STATUSES[section.availabilityStatus],
        total: section.totalCount,
      },
    ]),
  );
}
