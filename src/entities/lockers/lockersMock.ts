import type { LockerAssignment } from "@/entities/lockers/types";

// Figma: 사물함 배정 상태 배정완료 (nodeId 3147:148357), 빈 상태 (3147:148331)
// Figma는 B-25지만 칸 배치 목데이터가 A-1·A-2만 있어서 위치 보기가 열리도록 A-1구역 칸으로 둔다.
const ASSIGNED: LockerAssignment = {
  appliedAt: "2026-09-05T13:59",
  lockerLabel: "A-7",
  sectionId: "A-1",
  semester: "2026-2학기",
  usageEndDate: "2026-12-15",
  usageStartDate: "2026-09-07",
};

// 상태를 바꿔 배정 상태 화면을 확인한다
type LockerAssignmentMockState = "assigned" | "empty";
const LOCKER_ASSIGNMENT_MOCK_STATE: LockerAssignmentMockState = "assigned";

export const LOCKER_ASSIGNMENT_MOCK =
  LOCKER_ASSIGNMENT_MOCK_STATE === "assigned" ? ASSIGNED : null;
