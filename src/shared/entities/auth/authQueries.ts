import { api, setAccessToken } from "@/shared/api";
import type {
  KConnectLoginResponse,
  KConnectUser,
} from "@/shared/entities/auth/authTypes";

// 서버로 보내는 K-CONNECT 인증 결과 — @billilge/oauth-kconnect가 돌려주는 값 중 서버가 쓰는 세 가지다.
export interface KConnectCredentials {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

// K-CONNECT 로그인 화면을 거쳐 돌려받은 `{ code, codeVerifier, redirectUri }`를 서버로 보내 서비스 로그인을 마친다.
// 서버가 K-CONNECT 토큰 교환과 재학생 확인을 하고 서비스 액세스 토큰을 내려 준다(POST /v1/auth/login/kconnect).
// 토큰은 가입을 마치지 않은 회원에게도 내려오므로 여기서 바로 저장하고, 로그인 표시(markLoggedIn)는 호출하는 쪽이
// 가입 여부(`isNewUser`)를 보고 남긴다 — 신규 사용자는 가입 제출 요청에 이 토큰이 필요하다.
export async function exchangeKConnectCode(
  credentials: KConnectCredentials,
): Promise<KConnectUser> {
  const response = await api.post<KConnectLoginResponse>(
    "/v1/auth/login/kconnect",
    credentials,
  );
  setAccessToken(response.accessToken);
  return { isNewUser: response.signUpRequired, name: response.name };
}
