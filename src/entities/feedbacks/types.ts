export type FeedbackRound = "1차" | "2차" | "3차" | "4차";

export interface Feedback {
  id: string;
  question: string;
  round: FeedbackRound;
  answer?: string;
  // 상세페이지(모아보기)의 "학생회 답변" 날짜. 답변이 없으면 의미가 없어 answer와 함께 옵셔널이다.
  answerDate?: string;
}

// 내가 쓴 피드백 — 작성일이 붙는다. 답변이 달리면 같은 id로 열린피드백 목록에도 보인다.
export interface MyFeedback extends Feedback {
  createdAt: string;
}
