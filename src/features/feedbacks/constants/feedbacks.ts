import type { FilterChipOption } from "@/components/ui/FilterChipGroup";

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
