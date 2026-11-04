import {
  MOCK_EMAIL_CODE,
  MOCK_EXISTING_USER,
  MOCK_NEW_USER,
  mockDelay,
  readMockLogin,
} from "@/shared/entities/auth/authMock";
import type {
  KConnectUser,
  OnboardingSubmission,
} from "@/shared/entities/auth/authTypes";

// 서버로 보내는 K-CONNECT 인증 결과 — @billilge/oauth-kconnect가 돌려주는 값 중 서버가 쓰는 세 가지다.
export interface KConnectCredentials {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

// K-CONNECT 로그인 화면을 거쳐 돌려받은 `{ code, codeVerifier, redirectUri }`를 서버로 보내 서비스 로그인을 마치는 자리다.
// 서버는 POST /auth/kconnect로 이 값을 받아 토큰 교환, 재학생 확인, 서비스 토큰 발급을 한다(oauth-kconnect 서버 가이드).
// 서버 주소와 응답 형식(서비스 토큰, 신규 사용자 여부)이 정해지기 전까지는 응답만 흉내 낸다(authMock.ts).
// TODO: 실 API가 붙으면 목 응답(readMockLogin·MOCK_*·authMock.ts)을 지운다.
export async function exchangeKConnectCode(
  _credentials: KConnectCredentials,
): Promise<KConnectUser> {
  await mockDelay();
  const mockLogin = readMockLogin();
  if (mockLogin === "fail") {
    throw new Error("K-CONNECT 로그인에 실패했어요.");
  }
  return mockLogin === "existing" ? MOCK_EXISTING_USER : MOCK_NEW_USER;
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

// 온보딩 정보를 서버에 저장하는 자리 — 실 API가 붙을 때까지는 응답만 흉내 낸다.
export async function submitOnboarding(
  _submission: OnboardingSubmission,
): Promise<void> {
  await mockDelay();
}
