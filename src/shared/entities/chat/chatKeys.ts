// 챗봇 조회 캐시 key. 답변은 스트리밍이라 캐시하지 않고, 추천 질문(FAQ) 목록만 받아 둔다.
export const chatKeys = {
  root: () => ["chat"] as const,
  faqs: () => [...chatKeys.root(), "faqs"] as const,
};
