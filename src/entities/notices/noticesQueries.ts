import { queryOptions } from "@tanstack/react-query";

import { fetchNotice, fetchNotices } from "@/entities/notices/noticesApi";

// 쿼리 키와 요청 함수를 한곳에 묶어 둔다. 화면은 useSuspenseQuery(noticesQueries.list())처럼 쓴다.
export const noticesQueries = {
  detail: (noticeId: string) =>
    queryOptions({
      queryFn: () => fetchNotice(noticeId),
      queryKey: ["notices", noticeId],
    }),
  list: () =>
    queryOptions({
      queryFn: fetchNotices,
      queryKey: ["notices"],
    }),
};
