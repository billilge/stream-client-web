// K-CONNECT 인증이 돌려주는 사용자 — 신규 사용자면 온보딩(연락처·약관)을 거친다.
export interface KConnectUser {
  /** K-CONNECT가 알려 준 이름 — 온보딩 인삿말에 쓴다 */
  name: string;
  isNewUser: boolean;
}

// POST /v1/auth/login/kconnect 응답 — signUpRequired는 가입(전화번호·필수 약관)을 마치지 않았으면 true다
export interface KConnectLoginResponse {
  accessToken: string;
  name: string;
  signUpRequired: boolean;
}
