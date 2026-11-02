import { queryOptions } from "@tanstack/react-query";

import { MY_FEEDBACKS_MOCK } from "@/entities/feedbacks/feedbacksMock";
import { mockupResponse } from "@/lib/mockupApi";

const feedbacksKeys = {
  root: () => ["feedbacks"] as const,
  mine: () => [...feedbacksKeys.root(), "mine"] as const,
  myDetail: (feedbackId: string) =>
    [...feedbacksKeys.mine(), feedbackId] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const feedbacksQueries = {
  mine: () =>
    queryOptions({
      queryKey: feedbacksKeys.mine(),
      queryFn: () => mockupResponse(() => MY_FEEDBACKS_MOCK),
    }),
  // 없는 피드백은 null — 작성내역 상세 화면이 작성내역 목록으로 보낸다.
  myDetail: (feedbackId: string) =>
    queryOptions({
      queryKey: feedbacksKeys.myDetail(feedbackId),
      queryFn: () =>
        mockupResponse(
          () =>
            MY_FEEDBACKS_MOCK.find((item) => item.id === feedbackId) ?? null,
        ),
    }),
};
