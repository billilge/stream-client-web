import { queryOptions } from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { billilgeKeys } from "@/shared/entities/billilge/billilgeKeys";
import { BILLILGE_ITEMS } from "@/shared/entities/billilge/billilgeMock";

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const billilgeQueries = {
  items: () =>
    queryOptions({
      queryKey: billilgeKeys.items(),
      queryFn: () => mockupResponse(() => BILLILGE_ITEMS),
    }),
};
