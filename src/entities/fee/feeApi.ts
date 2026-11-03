import { queryOptions } from "@tanstack/react-query";

import type { FeeResponse } from "@/entities/fee/types";
import { api } from "@/lib/api/client";

const feeKeys = {
  root: () => ["fee"] as const,
  me: () => [...feeKeys.root(), "me"] as const,
};

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const feeQueries = {
  // 내 납부 현황(GET /v1/app/fee/me) — 납부내역과 행사 상세의 학생회비 납부자 전용 판단이 같이 쓴다.
  me: () =>
    queryOptions({
      queryKey: feeKeys.me(),
      queryFn: ({ signal }) =>
        api.get<FeeResponse>("/v1/app/fee/me", { signal }),
    }),
};
