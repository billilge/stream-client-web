// 서버가 로그인 때 내려 준 액세스 토큰(1시간짜리, 재발급 없음)을 sessionStorage에 둔다.
// 같은 탭에서는 새로고침해도 남고, 탭을 닫으면 사라진다 — 로그인 표시(session.ts)와 같은 수명이다.
// 재발급이나 앱(WebView 셸) 보관으로 바뀌면 이 파일만 고친다 — 요청 코드는 아래 함수로만 토큰을 다룬다.
const ACCESS_TOKEN_STORAGE_KEY = "stream:auth:access-token";

type TokenListener = () => void;

const listeners = new Set<TokenListener>();

export function getAccessToken(): string | null {
  try {
    return window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("액세스 토큰을 읽지 못했어요.", error);
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.warn("액세스 토큰을 저장하지 못했어요.", error);
    // 저장하지 못했으면 토큰이 바뀐 게 아니라 알리지 않는다
    return;
  }
  notifyTokenListeners();
}

// 로그아웃·탈퇴, 그리고 서버가 401로 토큰을 거절했을 때 부른다
export function clearAccessToken(): void {
  try {
    window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.warn("액세스 토큰을 지우지 못했어요.", error);
  }
  notifyTokenListeners();
}

// 서버는 토큰 payload의 roles 클레임에 역할을 싣는다 — 관리자는 ["ADMIN", "STUDENT"]다(stream-server AuthTokenIssuer).
// 관리자 전용 UI(알림 화면의 관리자 알림 탭)를 보일지만 정한다. 서명은 확인하지 않으므로 실제 권한은 서버가
// /v1/admin/**에서 막는다. 역할이 바뀌면 다시 로그인해 새 토큰을 받아야 반영된다.
export function hasAdminRole(): boolean {
  const payload = getAccessToken()?.split(".")[1];
  if (payload === undefined) {
    return false;
  }
  try {
    // JWT payload는 base64url이다 — atob이 읽는 base64로 바꾼다(패딩은 없어도 읽는다)
    const claims: unknown = JSON.parse(
      window.atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return (
      typeof claims === "object" &&
      claims !== null &&
      "roles" in claims &&
      Array.isArray(claims.roles) &&
      claims.roles.includes("ADMIN")
    );
  } catch (error) {
    console.warn("액세스 토큰의 역할을 읽지 못했어요.", error);
    return false;
  }
}

// 토큰이 바뀌면 알린다 — 토큰이 사라지면 로그인 화면으로 보내는 가드(AuthEntryGate)가 구독한다.
// 요청 코드(apiClient)가 라우터를 직접 부르지 않게 하려고 둔다(router → 화면 → entities → apiClient 순환 import).
export function subscribeTokens(listener: TokenListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyTokenListeners(): void {
  for (const listener of listeners) {
    listener();
  }
}
