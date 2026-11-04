import type { z } from "zod";

import type {
  feedbackPageSchema,
  feedbackRoundsSchema,
  feedbackSchema,
} from "@/shared/entities/feedbacks/feedbacksQueries";

// 서버 학생 앱 열린피드백 API(/v1/app/feedbacks/**) 응답 모양 그대로다 — feedbacksQueries.ts의 응답 검사 스키마에서 만든다.
// 화면 모양(차수 라벨·날짜 표기)은 화면 쪽에서 바꾼다.

// 피드백 한 건 — 답변이 없거나 공개 전이면 answer·answeredAt이 비어 있다
export type FeedbackResponse = z.infer<typeof feedbackSchema>;

export type FeedbackPageResponse = z.infer<typeof feedbackPageSchema>;

export type FeedbackRoundsResponse = z.infer<typeof feedbackRoundsSchema>;
