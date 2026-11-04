// 조회 캐시 key. 홈은 화면 전체를 한 번에 받아서 key가 하나다.
export const homeKeys = {
  root: () => ["home"] as const,
};
