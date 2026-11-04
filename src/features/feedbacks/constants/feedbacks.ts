import { formatDate } from "@/lib/date";

// 연도 메뉴의 "전체" 항목 값 — 메뉴 값은 문자열이라 연도 숫자와 구분하려고 따로 둔다
export const FEEDBACK_FILTER_ALL = "all";

// 피드백을 보내지 못했을 때 토스트 문구 — 접수 기간이 아닌 경우(서버 FEEDBACK_NOT_OPEN)와 그 밖의 실패를 나눈다
export const FEEDBACK_NOT_OPEN_MESSAGE =
  "지금은 피드백을 받는 기간이 아니에요.";
export const FEEDBACK_SEND_FAILURE_MESSAGE =
  "피드백을 보내지 못했어요. 다시 시도해 주세요.";

// 열린피드백 모아보기 경로
export function getFeedbackPath(feedbackId: number | string) {
  return `/feedbacks/${feedbackId}`;
}

// 열린피드백 작성내역 목록·상세 경로
export const MY_FEEDBACKS_PATH = "/my/feedbacks";

export function getMyFeedbackPath(feedbackId: number | string) {
  return `${MY_FEEDBACKS_PATH}/${feedbackId}`;
}

// 서버의 회차 번호(2)를 화면 라벨("2차")로 바꾼다
export function formatFeedbackRound(round: number) {
  return `${round}차`;
}

// 서버 일시("2026-05-06T10:00:00")에서 날짜만 "2026-05-06"으로 읽는다 — 상세 화면이 이 표기를 쓴다
export function getFeedbackDate(value: string) {
  return value.slice(0, 10);
}

// 목록 카드가 쓰는 "2026.05.06" 표기
export function formatFeedbackDate(value: string) {
  return formatDate(getFeedbackDate(value));
}

// 학생회 답변이 달렸는지 — 목록 카드(답변완료/답변대기)와 상세(답변/준비 중)가 같은 기준을 쓴다.
// 서버는 답변이 없거나 공개 전이면 비워서 주고, 빈 문자열로 와도 답변이 없는 것으로 본다.
export function hasFeedbackAnswer(feedback: { answer?: string | null }) {
  return Boolean(feedback.answer?.trim());
}
