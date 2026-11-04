import { isApiError, NetworkError, TimeoutError } from "@/shared/api";
import { LOCKERS_ERROR_CODES } from "@/shared/entities/lockers/lockersQueries";

// 신청이 실패한 이유. 오류 화면 주소(`.../failure/:reason`)에 그대로 쓴다.
export type LockersApplyFailureReason =
  | "taken"
  | "already-assigned"
  | "all-closed"
  | "network"
  | "server";

export interface LockersApplySuccess {
  lockerLabel: string;
  usageStartDate: string;
  usageEndDate: string;
}

// 신청 중 화면 문구 — 칸 선택 화면과 오류 화면(다시 시도)이 같이 쓴다. Figma: 사물함 신청 로딩 (1737:218076)
export const LOCKERS_APPLY_SUBMITTING_TEXT = {
  description: "곧 완료돼요! 잠시만 기다려 주세요",
  title: "사물함 신청을 진행 중이에요",
};

// 이용 기간은 신청 응답을 읽지 못했을 때 완료 화면을 채우는 값이다(기간 조회에서 받는다)
export interface LockersApplyRequest extends LockersApplySuccess {
  lockerPeriodId: number;
  lockerId: number;
}

export function toLockersApplyFailureReason(
  error: unknown,
): LockersApplyFailureReason {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return "network";
  }
  if (!isApiError(error)) {
    return "server";
  }
  switch (error.code) {
    case LOCKERS_ERROR_CODES.lockerTaken:
      return "taken";
    case LOCKERS_ERROR_CODES.alreadyAssigned:
      return "already-assigned";
    case LOCKERS_ERROR_CODES.applyNotOpen:
    case LOCKERS_ERROR_CODES.periodNotFound:
      return "all-closed";
    default:
      return "server";
  }
}
