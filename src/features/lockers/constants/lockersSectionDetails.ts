import type { LockerSectionDetailResponse } from "@/shared/entities/lockers/lockersTypes";

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
  // 배치를 아직 등록하지 않았거나(서버 null) 이 앱이 모르는 형식 버전이면 null
  layout: LockersLayout | null;
  photoUrls: string[];
  lockers: LockersSectionLocker[];
}

const LOCKERS_LAYOUT_VERSION = 1;

export function toLockersSectionDetail(
  response: LockerSectionDetailResponse,
): LockersSectionDetail {
  const { layout } = response;
  return {
    layout:
      layout?.version === LOCKERS_LAYOUT_VERSION
        ? {
            root: layout.root as unknown as LockersLayoutBlock,
            version: LOCKERS_LAYOUT_VERSION,
          }
        : null,
    lockers: response.lockers,
    photoUrls: response.photoUrls,
    section: response.section,
    sectionId: response.sectionId,
  };
}
