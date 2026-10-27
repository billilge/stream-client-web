// 빌릴게의 대여/반납 탭은 경로로 나눈다(행사 목록 EVENTS_TAB_PATHS와 같은 방식) — 새로고침·뒤로가기에도
// 탭이 유지되고, 홈 대여 현황 "더보기"처럼 다른 화면에서도 반납 탭으로 바로 보낼 수 있다.
export const BILILGE_TAB_PATHS = {
  rent: "/bililge",
  return: "/bililge/returns",
} as const;

export type BililgeTab = keyof typeof BILILGE_TAB_PATHS;
