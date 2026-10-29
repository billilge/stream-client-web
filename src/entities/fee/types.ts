// 납부확인중 · 확인필요 · 납부완료 — 미납이면 내역이 없다(홈에서 납부하기로 안내)
export type FeePaymentStatus = "checking" | "needs-check" | "paid";

interface FeePaymentBase {
  id: string;
  title: string;
  // 확인 전이거나 입금자를 확인하지 못하면 금액·확인일시가 비어 있다
  amount: number | null;
  paidAt: string;
  confirmedAt: string | null;
}

// 학생회 확인 내용은 확인필요일 때만 온다 — 상태로 갈라 두어 화면이 상태만 보고 판단하게 한다
export type FeePayment = FeePaymentBase &
  (
    | { status: "checking" | "paid" }
    | { status: "needs-check"; reviewNote: string }
  );

// 학생 본인의 학생회비 납부 상태 — GET /v1/app/fee/me의 feeStatus(UNPAID·PENDING·PAID).
// 납부확인중(pending)은 아직 납부로 보지 않는다.
export type MyFeeStatus = "unpaid" | "pending" | "paid";
