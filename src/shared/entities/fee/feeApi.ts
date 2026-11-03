import { queryOptions } from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import {
  FEE_PAYMENTS_MOCK,
  MY_FEE_STATUS_MOCK,
} from "@/shared/entities/fee/feeMock";

const feeKeys = {
  root: () => ["fee"] as const,
  payments: () => [...feeKeys.root(), "payments"] as const,
  myStatus: () => [...feeKeys.root(), "me"] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const feeQueries = {
  payments: () =>
    queryOptions({
      queryKey: feeKeys.payments(),
      queryFn: () => mockupResponse(() => FEE_PAYMENTS_MOCK),
    }),
  // 내 납부 상태(GET /v1/app/fee/me) — 학생회비 납부자 전용 행사의 신청 가능 여부에 쓴다.
  myStatus: () =>
    queryOptions({
      queryKey: feeKeys.myStatus(),
      queryFn: () => mockupResponse(() => MY_FEE_STATUS_MOCK),
    }),
};
