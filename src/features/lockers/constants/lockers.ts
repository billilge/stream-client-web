import type { LockerAssignmentStatus } from "@/entities/lockers/types";

// 사물함 배정 상태 배지 — 사물함 배정 상태 화면과 홈 내 정보 목록(HomeInfoList)이 같이 쓴다.
// color가 없으면 회색(neutral) 배지다.
// Figma: 사물함 배정 상태 뱃지 (nodeId 3147:146479)
// satisfies로 두어 상태별 값(예: 배정완료는 green)이 타입에 그대로 남는다
export const LOCKER_STATUS_BADGES = {
  assigned: { color: "green", label: "배정완료" },
  expired: { color: "red", label: "기간종료" },
  none: { label: "미신청" },
} as const satisfies Record<
  LockerAssignmentStatus,
  { label: string; color?: "red" | "green" }
>;

// 사물함 배정 상태·내 사물함(위치 보기) 화면 경로
export const LOCKER_ASSIGNMENT_PATH = "/my/locker";
export const MY_LOCKER_LOCATION_PATH = "/my/locker/location";
