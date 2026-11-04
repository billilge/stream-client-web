// 조회 캐시 key. 공개 목록은 연도·차수 조건마다 따로 받고(연도·차수가 null이면 거르지 않는다),
// 작성한 피드백(mine)은 새 질문을 보낸 뒤 이 key 하나로 무효화한다.
export const feedbacksKeys = {
  root: () => ["feedbacks"] as const,
  lists: () => [...feedbacksKeys.root(), "list"] as const,
  list: (year: number | null, round: number | null) =>
    [...feedbacksKeys.lists(), year, round] as const,
  recent: () => [...feedbacksKeys.root(), "recent"] as const,
  rounds: (year: number | null) =>
    [...feedbacksKeys.root(), "rounds", year] as const,
  roundFeedbacks: (year: number, round: number) =>
    [...feedbacksKeys.root(), "round-feedbacks", year, round] as const,
  detail: (feedbackId: number) =>
    [...feedbacksKeys.root(), "detail", feedbackId] as const,
  mine: () => [...feedbacksKeys.root(), "mine"] as const,
};
