import { queryOptions } from "@tanstack/react-query";

import { NOTICES } from "@/entities/notices/noticesMock";
import { mockupResponse } from "@/lib/mockupApi";

const noticesKeys = {
  root: () => ["notices"] as const,
  list: () => [...noticesKeys.root(), "list"] as const,
  detail: (noticeId: string) =>
    [...noticesKeys.root(), "detail", noticeId] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const noticesQueries = {
  list: () =>
    queryOptions({
      queryKey: noticesKeys.list(),
      queryFn: () => mockupResponse(() => NOTICES),
    }),
  // 없는 공지는 null — 상세 화면이 "존재하지 않는 공지예요"를 그린다.
  detail: (noticeId: string) =>
    queryOptions({
      queryKey: noticesKeys.detail(noticeId),
      queryFn: () =>
        mockupResponse(
          () => NOTICES.find((notice) => notice.id === noticeId) ?? null,
        ),
    }),
};
