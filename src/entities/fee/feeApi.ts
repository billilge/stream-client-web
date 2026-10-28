import { queryOptions } from "@tanstack/react-query";

import { FEE_PAYMENTS_MOCK } from "@/entities/fee/feeMock";
import { mockupResponse } from "@/lib/mockupApi";

const feeKeys = {
  root: () => ["fee"] as const,
  payments: () => [...feeKeys.root(), "payments"] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const feeQueries = {
  payments: () =>
    queryOptions({
      queryKey: feeKeys.payments(),
      queryFn: () => mockupResponse(() => FEE_PAYMENTS_MOCK),
    }),
};
