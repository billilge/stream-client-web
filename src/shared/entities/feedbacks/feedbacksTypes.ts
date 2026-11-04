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

// 검색 결과의 열린피드백 — 검색은 아직 목데이터라(서버 검색 API 연동 전) 예전 화면 모양을 그대로 쓴다.
// 검색을 서버에 붙이면 이 타입과 feedbacksMock.ts는 사라진다.
export type FeedbackRound = "1차" | "2차" | "3차" | "4차";

export interface Feedback {
  id: string;
  question: string;
  // 몇 년도 차수인지("2026") — 차수는 해마다 1차부터 다시 열려서 연도와 같이 봐야 한다
  year: string;
  round: FeedbackRound;
  answer?: string;
  answerDate?: string;
}
