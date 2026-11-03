// 학생 본인의 학생회비 납부 상태 — 서버(GET /v1/app/fee/me의 feeStatus) 문자열 그대로 쓴다.
// 한 번도 요청하지 않았으면 UNPAID(서버 DB에는 없고 응답에서만 쓰는 상태)다. 납부확인중(PENDING)은 아직 납부로 보지 않는다.
export type FeeStatus = "UNPAID" | "PENDING" | "PAID" | "REJECTED";

// 납부를 요청한 뒤의 상태(납부확인중 · 확인필요 · 납부완료) — 미납이면 내역이 없다(홈에서 납부하기로 안내)
export type FeePaymentStatus = Exclude<FeeStatus, "UNPAID">;

// 내 학생회비 납부 현황(서버 FeeResponse). 학생회비 조회·납부 요청이 같은 모양으로 준다.
// 금액·송금 링크는 지금 낼 수 있을 때(UNPAID·REJECTED에 남은 학기 수를 보냈을 때)만 계산해 주고,
// PENDING·PAID면 요청 때 남긴 금액만 준다(링크는 null). 일시는 시간대 없는 서버 시각("2026-09-04T11:49:00")이다.
export interface FeeResponse {
  /** 한 번도 요청하지 않았으면 null */
  studentTransferStatusId: number | null;
  feeStatus: FeeStatus;
  bank: string;
  accountNo: string;
  remainingSemesters: number | null;
  transferAmount: number | null;
  /** 금액이 채워진 토스 송금 딥링크(supertoss://send?…) */
  transferLinkUrl: string | null;
  requestedAt: string | null;
  /** 납부완료(PAID)일 때만 있다 */
  confirmedAt: string | null;
  /** 확인필요(REJECTED)일 때만 있다 — 그때는 서버가 항상 채운다 */
  rejectReason: string | null;
}

// POST /v1/app/fee 요청 — 송금을 마친 뒤 남은 학기 수와 그 근거인 학점이수현황 캡처를 함께 낸다
export interface FeeSubmitRequest {
  remainingSemesters: number;
  /** 업로드 때 받은 캡처의 파일 키 */
  proofImageKey: string;
}
