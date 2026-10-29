import { LOCKER_ASSIGNMENT_MOCK } from "@/entities/lockers/lockersMock";
import type { LockerAssignment } from "@/entities/lockers/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchMyLockerAssignment(): Promise<LockerAssignment | null> {
  return mockupApi("lockers/assignment", () => LOCKER_ASSIGNMENT_MOCK);
}
