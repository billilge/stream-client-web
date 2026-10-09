// 납부확인중 · 확인필요 · 납부완료 — 미납이면 내역이 없다(홈에서 납부하기로 안내)
export type FeePaymentStatus = "checking" | "needs-check" | "paid";

export interface FeePayment {
  id: string;
  status: FeePaymentStatus;
  title: string;
  // 확인 전이거나 입금자를 확인하지 못하면 금액·확인일시가 비어 있다
  amount: number | null;
  paidAt: string;
  confirmedAt: string | null;
  // 확인필요일 때 학생회가 남긴 확인 내용
  reviewNote?: string;
}
