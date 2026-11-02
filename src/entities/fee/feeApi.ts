import { FEE_PAYMENTS_MOCK, MY_FEE_STATUS_MOCK } from "@/entities/fee/feeMock";
import type { FeePayment, MyFeeStatus } from "@/entities/fee/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchFeePayments(): Promise<FeePayment[]> {
  return mockupApi("fee/payments", () => FEE_PAYMENTS_MOCK);
}

// 내 납부 상태(GET /v1/app/fee/me) — 학생회비 납부자 전용 행사의 신청 가능 여부에 쓴다.
export function fetchMyFeeStatus(): Promise<MyFeeStatus> {
  return mockupApi("fee/me", () => MY_FEE_STATUS_MOCK);
}
