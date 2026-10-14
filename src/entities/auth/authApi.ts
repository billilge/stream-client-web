import {
  MOCK_EXISTING_USER,
  MOCK_NEW_USER,
  mockDelay,
  readMockLogin,
} from "@/entities/auth/authMock";
import type { KConnectUser, OnboardingSubmission } from "@/entities/auth/types";

// 서버로 보내는 K-CONNECT 인증 결과 — @billilge/oauth-kconnect가 돌려주는 값 중 서버가 쓰는 세 가지다.
export interface KConnectCredentials {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

// K-CONNECT 로그인 화면을 거쳐 돌려받은 `{ code, codeVerifier, redirectUri }`를 서버로 보내 서비스 로그인을 마치는 자리다.
// 서버는 POST /auth/kconnect로 이 값을 받아 토큰 교환, 재학생 확인, 서비스 토큰 발급을 한다(oauth-kconnect 서버 가이드).
// 서버 주소와 응답 형식(서비스 토큰, 신규 사용자 여부)이 정해지기 전까지는 응답만 흉내 낸다(authMock.ts).
// 로그인은 요청마다 결과가 달라지는 동작이라 요청 단위로 Promise를 재사용하는 mockupApi를 쓰지 않는다.
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

// 온보딩 정보를 서버에 저장하는 자리 — 실 API가 붙을 때까지는 응답만 흉내 낸다.
export async function submitOnboarding(
  _submission: OnboardingSubmission,
): Promise<void> {
  await mockDelay();
}
