import type { AppVersion, MyAccount } from "@/entities/users/types";

// Figma 설정 화면(3524:152322)에 적힌 값 그대로. 실 API가 붙으면 이 파일은 사라진다.
export const MY_ACCOUNT: MyAccount = {
  email: "pog454@kookmin.ac.kr",
  name: "이예담",
  phone: "010-1234-5678",
};

export const APP_VERSION: AppVersion = {
  isLatest: true,
  version: "26.0.1",
};
