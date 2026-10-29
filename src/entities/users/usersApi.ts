import type { AppVersion, MyAccount } from "@/entities/users/types";
import { APP_VERSION, MY_ACCOUNT } from "@/entities/users/usersMock";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
//
// 백엔드 연동 시 확인할 것: 설정 화면은 묶음 이름이고 데이터는 `users` 도메인이라고 보고
// 여기에 뒀다(terminology.md에 `settings`는 없다). 엔드포인트가 `/api/users/me`가 아니라
// 설정 전용으로 따로 나오면 도메인 폴더와 라우트(`/settings`)를 그때 맞춘다.
export function fetchMyAccount(): Promise<MyAccount> {
  return mockupApi("users/me", () => MY_ACCOUNT);
}

// 앱 버전은 계정과 다른 요청이라 key를 나눈다 — 설정 화면이 둘을 한 카드에 섞어 쓰지 않는다.
export function fetchAppVersion(): Promise<AppVersion> {
  return mockupApi("users/app-version", () => APP_VERSION);
}
