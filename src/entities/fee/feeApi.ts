import { queryOptions } from "@tanstack/react-query";

import type { FeeResponse } from "@/entities/fee/types";
import { api } from "@/lib/api/client";

const feeKeys = {
  root: () => ["fee"] as const,
  me: () => [...feeKeys.root(), "me"] as const,
  transferGuide: (remainingSemesters: number) =>
    [...feeKeys.root(), "transfer-guide", remainingSemesters] as const,
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
  // 남은 학기 수로 계산한 금액과 토스 송금 링크 — 같은 API에 학기 수를 실어 보낸다(서버는 아무것도 저장하지 않는다).
  // 지금 낼 수 없는 상태(납부확인중·납부완료)면 링크가 null이다.
  transferGuide: (remainingSemesters: number) =>
    queryOptions({
      queryKey: feeKeys.transferGuide(remainingSemesters),
      queryFn: ({ signal }) =>
        api.get<FeeResponse>("/v1/app/fee/me", {
          params: { remainingSemesters },
          signal,
        }),
    }),
};
