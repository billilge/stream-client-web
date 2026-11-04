import type { AppVersion } from "@/shared/entities/members/membersTypes";

// 앱 버전은 서버에 API가 없어서 Figma 설정 화면(3524:152322)에 적힌 값을 그대로 쓴다.
// 버전을 받을 곳이 정해지면 이 파일은 사라진다.
export const APP_VERSION: AppVersion = {
  isLatest: true,
  version: "26.0.1",
};
