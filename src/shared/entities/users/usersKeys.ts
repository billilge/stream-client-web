// 앱 버전은 계정과 다른 요청이라 key를 나눈다 — 설정 화면이 둘을 한 카드에 섞어 쓰지 않는다.
export const usersKeys = {
  root: () => ["users"] as const,
  myAccount: () => [...usersKeys.root(), "me"] as const,
  appVersion: () => [...usersKeys.root(), "app-version"] as const,
};
