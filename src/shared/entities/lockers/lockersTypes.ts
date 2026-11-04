// 내 사물함 배정 — 신청하면 바로 확정이라 배정대기 상태가 없다. 신청하지 않았으면 null.
export interface LockerAssignment {
  semester: string;
  appliedAt: string;
  usageStartDate: string;
  usageEndDate: string;
  lockerLabel: string;
  // 사물함 위치 보기 — 이 구역의 칸 화면을 연다
  sectionId: string;
}

// 홈 내 정보 목록의 사물함 배정 상태 — 미신청 · 배정완료 · 기간종료
export type LockerAssignmentStatus = "none" | "assigned" | "expired";
