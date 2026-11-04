// 조회 캐시 key. 반납 필요 대여는 대여 이력 key 아래에 둬서, 이력 key 하나로 둘을 같이 무효화한다.
export const billilgeKeys = {
  root: () => ["billilge"] as const,
  items: () => [...billilgeKeys.root(), "items"] as const,
  histories: () => [...billilgeKeys.root(), "histories"] as const,
  returnRequired: () =>
    [...billilgeKeys.histories(), "return-required"] as const,
};
