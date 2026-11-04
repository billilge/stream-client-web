import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { archiveListItemSchema } from "@/shared/entities/archives/archivesQueries";
import { billilgeItemSchema } from "@/shared/entities/billilge/billilgeQueries";
import { eventListItemSchema } from "@/shared/entities/events/eventsQueries";
import { feedbackSchema } from "@/shared/entities/feedbacks/feedbacksQueries";
import { noticeListItemSchema } from "@/shared/entities/notices/noticesQueries";
import { searchKeys } from "@/shared/entities/search/searchKeys";

// 서버가 받는 검색어 최대 길이 — 넘으면 400 INVALID_INPUT이라 입력칸에서 막는다
export const SEARCH_KEYWORD_MAX_LENGTH = 50;

// 섹션 하나(서버 PreviewResponse) — 앞의 몇 건(지금은 2건)과 전체 수. 이어 받지 않아서 커서가 없다
function previewSchema<T extends z.ZodType>(itemSchema: T) {
  return z.looseObject({
    content: z.array(itemSchema),
    totalCount: z.number(),
  });
}

// 통합 검색 응답 — 카드는 각 목록 API의 항목 응답 그대로라 도메인 스키마를 쓴다. 섹션이 비어도 필드는 빠지지 않는다.
// 빌릴게 섹션의 서버 이름은 items다.
export const searchResponseSchema = z.looseObject({
  // 다섯 섹션 전체 수의 합 — 0이면 검색 결과가 없다
  totalCount: z.number(),
  events: previewSchema(eventListItemSchema),
  notices: previewSchema(noticeListItemSchema),
  feedbacks: previewSchema(feedbackSchema),
  items: previewSchema(billilgeItemSchema),
  archives: previewSchema(archiveListItemSchema),
});

// 화면은 이 queryOptions로만 데이터를 받는다. 탭·더보기의 전체 목록은 각 도메인 목록 조회에 keyword를 넘겨 받는다.
export const searchQueries = {
  // 검색 화면 전체 탭과 탭별 개수(GET /v1/app/search). 검색어는 화면이 앞뒤 공백을 지워 넘긴다.
  results: (keyword: string) =>
    queryOptions({
      queryKey: searchKeys.results(keyword),
      queryFn: async ({ signal }) =>
        searchResponseSchema.parse(
          await api.get<unknown>("/v1/app/search", {
            params: { keyword },
            signal,
          }),
        ),
    }),
};
