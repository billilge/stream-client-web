// 서비스 링크는 한 번에 받는 조회 하나뿐이라 root가 곧 조회 key다
export const serviceLinksKeys = {
  root: () => ["service-links"] as const,
};
