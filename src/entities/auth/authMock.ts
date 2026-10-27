import type { KConnectUser } from "@/entities/auth/types";

// 실 API가 붙기 전까지 인증 흐름을 흉내 내는 목 전용 코드다. 실 API로 바꿀 때 이 파일째 지운다.

const MOCK_DELAY_MS = 700;

export const MOCK_NEW_USER: KConnectUser = { isNewUser: true, name: "이예담" };
export const MOCK_EXISTING_USER: KConnectUser = {
  isNewUser: false,
  name: "이예담",
};

// 개발 서버에서는 화면의 로딩 상태를 확인할 수 있게 일부러 늦게 응답하고, 배포 빌드에서는 바로 응답한다(mockupApi와 같다).
export function mockDelay(): Promise<void> {
  if (!import.meta.env.DEV) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(resolve, MOCK_DELAY_MS);
  });
}

// 실패·기존 사용자 흐름을 화면에서 확인할 수 있게 콜백 주소의 쿼리로 로그인 결과를 고른다(개발 서버 전용):
//   /oauth/kconnect?...&mockLogin=fail      → 서버 실패(로그인 화면의 토스트)
//   /oauth/kconnect?...&mockLogin=existing  → 기존 사용자(바로 홈)
//   그 외                                    → 신규 사용자(온보딩)
// 배포 빌드에서는 쿼리를 읽지 않아서 주소에 붙여도 항상 신규 사용자로 처리된다.
export function readMockLogin(): string | null {
  if (!import.meta.env.DEV) {
    return null;
  }
  return new URLSearchParams(window.location.search).get("mockLogin");
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
  await mockDelay();
  return kind === "existing" ? MOCK_EXISTING_USER : MOCK_NEW_USER;
}
