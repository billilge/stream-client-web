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

// 토큰이 바뀌면 알린다 — 로그인 가드가 구독해서 토큰이 사라지면 로그인 화면으로 보낸다.
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
