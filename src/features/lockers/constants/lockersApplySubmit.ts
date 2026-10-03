// 신청이 실패한 이유. 오류 화면 주소(`.../failure/:reason`)에 그대로 쓴다.
export type LockersApplyFailureReason =
  | "taken" // 다른 사용자가 먼저 신청 (서버 LOCKER_ALREADY_ASSIGNED)
  | "all-closed" // 사물함 신청 전체 마감
  | "section-closed" // 고른 구역 마감
  | "network"
  | "server";

// 성공 값은 POST /v1/app/lockers/applications 응답(LockerApplyResponse)에서 화면에 쓰는 필드만 뽑았다
export interface LockersApplySuccess {
  lockerLabel: string;
  usageStartDate: string;
  usageEndDate: string;
}

export type LockersApplySubmitResult =
  | { type: "success"; application: LockersApplySuccess }
  | { type: "failure"; reason: LockersApplyFailureReason };

// 신청 중 화면 문구 — 칸 선택 화면과 오류 화면(다시 시도)이 같이 쓴다. Figma: 사물함 신청 로딩 (1737:218076)
export const LOCKERS_APPLY_SUBMITTING_TEXT = {
  description: "곧 완료돼요! 잠시만 기다려 주세요",
  title: "사물함 신청을 진행 중이에요",
};

export interface LockersApplyRequest {
  lockerId: number;
  lockerLabel: string;
}

// 신청 API가 붙기 전까지 쓰는 목업이다. 오류 화면을 확인하려면 이 값을 실패 이유로 바꿔서 실행한다.
const MOCK_OUTCOME: "success" | LockersApplyFailureReason = "success";
const MOCK_DELAY_MS = 2600;
// 사용 기간은 신청 전 유의사항(lockersNotice.ts)과 같은 목업 값이다
const MOCK_USAGE_START_DATE = "2026-09-01";
const MOCK_USAGE_END_DATE = "2026-12-15";

export function submitLockersApplication(
  request: LockersApplyRequest,
): Promise<LockersApplySubmitResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        MOCK_OUTCOME === "success"
          ? {
              application: {
                lockerLabel: request.lockerLabel,
                usageEndDate: MOCK_USAGE_END_DATE,
                usageStartDate: MOCK_USAGE_START_DATE,
              },
              type: "success",
            }
          : { reason: MOCK_OUTCOME, type: "failure" },
      );
    }, MOCK_DELAY_MS);
  });
}
