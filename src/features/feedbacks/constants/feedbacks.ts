import type { FilterChipOption } from "@/components/ui/FilterChipGroup";
import type { Feedback } from "@/entities/feedbacks/types";

export const FEEDBACK_ROUND_FILTERS: FilterChipOption[] = [
  { label: "전체", value: "all" },
  { label: "1차", value: "1차" },
  { label: "2차", value: "2차" },
  { label: "3차", value: "3차" },
  { label: "4차", value: "4차" },
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
