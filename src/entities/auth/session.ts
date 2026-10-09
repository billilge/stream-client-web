// "이 탭에서 로그인을 이미 거쳤다"는 표시만 sessionStorage에 남긴다(이름 같은 로그인 정보는 저장하지 않는다).
// 같은 탭에서는 새로고침해도 홈이 유지되고, 탭·브라우저를 닫았다가 새로 열면 사라져서 스플래시 → 로그인 화면부터
// 다시 시작한다. 실 인증이 붙으면 서버가 내려 준 세션(쿠키·토큰)으로 바뀐다.
const LOGGED_IN_STORAGE_KEY = "stream:auth:logged-in";

export function isLoggedIn(): boolean {
  try {
    return window.sessionStorage.getItem(LOGGED_IN_STORAGE_KEY) !== null;
  } catch (error) {
    console.warn("로그인 표시를 읽지 못했어요.", error);
    return false;
  }
}

export function markLoggedIn(): void {
  try {
    window.sessionStorage.setItem(LOGGED_IN_STORAGE_KEY, "1");
  } catch (error) {
    console.warn("로그인 표시를 저장하지 못했어요.", error);
  }
}
