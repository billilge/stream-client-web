import type { KConnectUser, OnboardingSubmission } from "@/entities/auth/types";

const MOCK_DELAY_MS = 700;

const MOCK_NEW_USER: KConnectUser = { isNewUser: true, name: "이예담" };
const MOCK_EXISTING_USER: KConnectUser = { isNewUser: false, name: "이예담" };

function delay(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS);
  });
}

// 실 인증 사이트(K-CONNECT)와 API가 정해지기 전까지 쓰는 가짜 로그인이다. 로그인은 요청마다 결과가
// 달라지는 동작이라 요청 단위로 Promise를 재사용하는 mockupApi를 쓰지 않는다.
// 실패·기존 사용자 흐름을 화면에서 확인할 수 있게 쿼리로 결과를 고른다(목 전용, 실 API가 붙으면 사라진다):
//   /auth/login?mockLogin=fail      → 실패(토스트)
//   /auth/login?mockLogin=existing  → 기존 사용자(바로 홈)
//   그 외                            → 신규 사용자(온보딩)
export async function loginWithKConnect(): Promise<KConnectUser> {
  await delay();
  const mockLogin = new URLSearchParams(window.location.search).get(
    "mockLogin",
  );
  if (mockLogin === "fail") {
    throw new Error("K-CONNECT 로그인에 실패했어요.");
  }
  return mockLogin === "existing" ? MOCK_EXISTING_USER : MOCK_NEW_USER;
}

// 온보딩 정보를 서버에 저장하는 자리 — 실 API가 붙을 때까지는 응답만 흉내 낸다.
export async function submitOnboarding(
  _submission: OnboardingSubmission,
): Promise<void> {
  await delay();
}
