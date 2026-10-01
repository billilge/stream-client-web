import { queryOptions } from "@tanstack/react-query";

import { fetchBililgeItems } from "@/entities/bililge/bililgeApi";

// 쿼리 키와 요청 함수를 한곳에 묶어 둔다. 화면은 useSuspenseQuery(bililgeQueries.items())처럼 쓴다.
export const bililgeQueries = {
  items: () =>
    queryOptions({
      queryFn: fetchBililgeItems,
      queryKey: ["bililge", "items"],
    }),
};
