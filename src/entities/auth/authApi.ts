import type { KConnectUser, OnboardingSubmission } from "@/entities/auth/types";

const MOCK_DELAY_MS = 700;

const MOCK_NEW_USER: KConnectUser = { isNewUser: true, name: "이예담" };
const MOCK_EXISTING_USER: KConnectUser = { isNewUser: false, name: "이예담" };

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS);
  });
}

// 서버로 보내는 K-CONNECT 인증 결과 — @billilge/oauth-kconnect가 돌려주는 값 그대로다.
export interface KConnectCredentials {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

// K-CONNECT 로그인 화면을 거쳐 돌려받은 `{ code, codeVerifier, redirectUri }`를 서버로 보내 서비스 로그인을 마치는 자리다.
// 서버는 POST /auth/kconnect로 이 값을 받아 토큰 교환, 재학생 확인, 서비스 토큰 발급을 한다(oauth-kconnect 서버 가이드).
// 서버 주소와 응답 형식(서비스 토큰, 신규 사용자 여부)이 정해지기 전까지는 응답만 흉내 낸다.
// 로그인은 요청마다 결과가 달라지는 동작이라 요청 단위로 Promise를 재사용하는 mockupApi를 쓰지 않는다.
// 실패·기존 사용자 흐름을 화면에서 확인할 수 있게 콜백 주소의 쿼리로 결과를 고른다(목 전용, 실 API가 붙으면 사라진다):
//   /oauth/kconnect?...&mockLogin=fail      → 서버 실패(로그인 화면의 토스트)
//   /oauth/kconnect?...&mockLogin=existing  → 기존 사용자(바로 홈)
//   그 외                                    → 신규 사용자(온보딩)
export async function exchangeKConnectCode(
  _credentials: KConnectCredentials,
): Promise<KConnectUser> {
  await delay();
  const mockLogin = new URLSearchParams(window.location.search).get(
    "mockLogin",
  );
  if (mockLogin === "fail") {
    throw new Error("K-CONNECT 로그인에 실패했어요.");
  }
  return mockLogin === "existing" ? MOCK_EXISTING_USER : MOCK_NEW_USER;
}

// 개발 서버에서 K-CONNECT 인증을 거치지 않고 "인증된 것으로 치고" 로그인 이후 흐름을 확인하는 우회다.
// `/auth?mockKConnect=new`(신규 사용자 → 온보딩), `/auth?mockKConnect=existing`(기존 사용자 → 홈).
// 호출하는 쪽이 `import.meta.env.DEV`일 때만 부르므로 배포 빌드에는 들어가지 않는다.
export type MockKConnectKind = "new" | "existing";

export function isMockKConnectKind(
  value: string | null,
): value is MockKConnectKind {
  return value === "new" || value === "existing";
}

export async function mockKConnectLogin(
  kind: MockKConnectKind,
): Promise<KConnectUser> {
  await delay();
  return kind === "existing" ? MOCK_EXISTING_USER : MOCK_NEW_USER;
}

// 온보딩 정보를 서버에 저장하는 자리 — 실 API가 붙을 때까지는 응답만 흉내 낸다.
export async function submitOnboarding(
  _submission: OnboardingSubmission,
): Promise<void> {
  await delay();
}
