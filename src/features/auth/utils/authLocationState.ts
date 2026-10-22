// K-CONNECT 콜백 화면(`/oauth/kconnect`)이 로그인 퍼널(`/auth`)로 결과를 넘기는 navigate state다.
// 콜백 주소에는 인증 `code`가 남으면 안 되어서 replace로 퍼널로 이동하면서 필요한 값만 state로 건넨다.
export interface AuthLocationState {
  /** K-CONNECT가 알려 준 이름 — 있으면 로그인을 건너뛰고 연락처 단계에서 시작한다(신규 사용자) */
  kConnectName?: string;
  /** 로그인이 실패·취소돼 돌아온 경우 — 로그인 화면에서 실패 토스트를 띄운다 */
  loginFailed?: boolean;
}

export function readAuthLocationState(state: unknown): AuthLocationState {
  if (typeof state !== "object" || state === null) {
    return {};
  }
  return {
    kConnectName:
      "kConnectName" in state && typeof state.kConnectName === "string"
        ? state.kConnectName
        : undefined,
    loginFailed: "loginFailed" in state && state.loginFailed === true,
  };
}
