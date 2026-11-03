import type { z } from "zod";

import type {
  LOCKER_APPLICATION_STATUSES,
  LOCKER_APPLY_STATUSES,
  LOCKER_AVAILABILITY_STATUSES,
  lockerApplyResponseSchema,
  lockerPeriodResponseSchema,
  lockerSectionDetailResponseSchema,
  lockerSectionListResponseSchema,
  myLockerApplicationListResponseSchema,
} from "@/shared/entities/lockers/lockersQueries";

// 내 사물함 배정 — 신청하면 바로 확정이라 배정대기 상태가 없다. 신청하지 않았으면 null.
export interface LockerAssignment {
  semester: string;
  status: Exclude<LockerAssignmentStatus, "none">;
  appliedAt: string;
  usageStartDate: string;
  usageEndDate: string;
  lockerLabel: string;
  // 사물함 위치 보기 — 이 구역의 칸 화면을 연다
  lockerPeriodId: number;
  sectionId: number;
}

// 홈 내 정보 목록의 사물함 배정 상태 — 미신청 · 배정완료 · 기간종료
export type LockerAssignmentStatus = "none" | "assigned" | "expired";

export type LockerApplyStatus = (typeof LOCKER_APPLY_STATUSES)[number];
export type LockerAvailabilityStatus =
  (typeof LOCKER_AVAILABILITY_STATUSES)[number];
export type LockerApplicationStatus =
  (typeof LOCKER_APPLICATION_STATUSES)[number];

export type LockerPeriodResponse = z.infer<typeof lockerPeriodResponseSchema>;
export type LockerSectionListResponse = z.infer<
  typeof lockerSectionListResponseSchema
>;
export type LockerSectionDetailResponse = z.infer<
  typeof lockerSectionDetailResponseSchema
>;
export type MyLockerApplicationListResponse = z.infer<
  typeof myLockerApplicationListResponseSchema
>;
export type LockerApplyResponse = z.infer<typeof lockerApplyResponseSchema>;

// 칸 배치 블록 트리. 서버는 저장한 JSON을 해석하지 않고 내려줘서 형식은 이 타입이 기준이다(lockersQueries의 스키마로 검사).
// layout은 구조만 갖고 칸 상태는 lockers에서 온다 — 둘은 lockerNumber로 잇는다.
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
