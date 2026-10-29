import { queryOptions } from "@tanstack/react-query";

import { BILILGE_ITEMS } from "@/entities/bililge/bililgeMock";
import { mockupResponse } from "@/lib/mockupApi";

const bililgeKeys = {
  root: () => ["bililge"] as const,
  items: () => [...bililgeKeys.root(), "items"] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const bililgeQueries = {
  items: () =>
    queryOptions({
      queryKey: bililgeKeys.items(),
      queryFn: () => mockupResponse(() => BILILGE_ITEMS),
    }),
};
