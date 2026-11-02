import type { Feedback, FeedbackRound } from "@/entities/feedbacks/types";

// "전체 피드백" 필터는 연도와 차수를 같이 건다. 이 값이면 그 조건으로는 거르지 않는다.
export const FEEDBACK_FILTER_ALL = "all";

export const FEEDBACK_ROUNDS: readonly FeedbackRound[] = [
  "1차",
  "2차",
  "3차",
  "4차",
];

// 열린피드백 작성내역 목록·상세 경로
export const MY_FEEDBACKS_PATH = "/my/feedbacks";

export function getMyFeedbackPath(feedbackId: string) {
  return `${MY_FEEDBACKS_PATH}/${feedbackId}`;
}

// 학생회 답변이 달렸는지 — 목록 카드(답변완료/답변대기)와 상세(답변/준비 중)가 같은 기준을 쓴다.
// 빈 문자열로 와도 답변이 없는 것으로 본다.
export function hasFeedbackAnswer(feedback: Feedback) {
  return Boolean(feedback.answer?.trim());
}
