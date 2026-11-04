import { api, setAccessToken } from "@/shared/api";
import { MOCK_EMAIL_CODE, mockDelay } from "@/shared/entities/auth/authMock";
import type {
  KConnectLoginResponse,
  KConnectUser,
  OnboardingSubmission,
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

// 입력한 인증번호가 틀렸을 때 — 네트워크 같은 다른 실패와 구분해서 화면이 안내 문구를 고른다.
export class EmailCodeMismatchError extends Error {
  name = "EmailCodeMismatchError";
}

// 이메일로 인증번호를 보내는 자리 — 서버 API가 정해질 때까지는 응답만 흉내 낸다. 다시 보내기도 같은 함수를 쓴다.
// TODO: 서버에 이메일 인증번호 발송·확인 API가 생기면 두 함수의 안쪽을 api.post로 바꾸고 MOCK_EMAIL_CODE를 지운다.
export async function requestEmailVerification(_email: string): Promise<void> {
  await mockDelay();
}

export async function verifyEmailCode(
  _email: string,
  code: string,
): Promise<void> {
  await mockDelay();
  if (code !== MOCK_EMAIL_CODE) {
    throw new EmailCodeMismatchError("인증번호가 올바르지 않아요.");
  }
}

// 가입 제출(POST /v1/app/members/sign-up) — 로그인 때 받은 토큰으로 전화번호와 약관 동의를 서버에 남긴다.
// 필수 약관 둘은 동의해야만 이 단계에 오므로 항상 동의로 보낸다. 선택 약관(알림 수신)은 서버에 약관 종류가 생기면
// (stream-server #229) 보내고, 이메일은 서버의 이메일 인증(#210)이 반영되면 요청에 싣는다 — 둘 다 지금은 보내지 않는다.
export async function submitOnboarding(
  submission: OnboardingSubmission,
): Promise<void> {
  await api.post("/v1/app/members/sign-up", {
    phoneNumber: submission.phone,
    termAgreements: [
      { termType: "PRIVACY_POLICY", agreed: true },
      { termType: "TERMS_OF_SERVICE", agreed: true },
    ],
  });
}
