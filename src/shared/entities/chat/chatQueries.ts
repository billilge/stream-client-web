import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/shared/api";
import { chatKeys } from "@/shared/entities/chat/chatKeys";

// 운영진이 등록한 추천 질문 — 등록 순서대로 최대 5개, 없으면 빈 배열이다.
// 질문은 100자 이하라 그대로 챗봇 질문(1~500자)으로 보낼 수 있다.
export const chatFaqsResponseSchema = z.array(
  z.looseObject({ faqId: z.number(), question: z.string() }),
);

// 화면은 이 queryOptions로만 데이터를 받는다
export const chatQueries = {
  // 챗봇 진입 화면 추천 질문(GET /v1/app/chat/faqs)
  faqs: () =>
    queryOptions({
      queryKey: chatKeys.faqs(),
      queryFn: async ({ signal }) =>
        chatFaqsResponseSchema.parse(
          await api.get<unknown>("/v1/app/chat/faqs", { signal }),
        ),
    }),
};
