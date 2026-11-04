// 앱 버전은 계정과 다른 요청이라 key를 나눈다 — 설정 화면이 둘을 한 카드에 섞어 쓰지 않는다.
export const membersKeys = {
  root: () => ["members"] as const,
  myAccount: () => [...membersKeys.root(), "me"] as const,
  appVersion: () => [...membersKeys.root(), "app-version"] as const,
};
