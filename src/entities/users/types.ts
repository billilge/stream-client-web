// 설정 화면 계정 정보 카드(Figma 3524:152329)가 보여 주는 내 계정 정보.
// 용어 사전(terminology.md)의 `사용자 → users` 도메인이다.
export interface MyAccount {
  name: string;
  email: string;
  /** `010-1234-5678` 형태. 전화번호 변경 화면이 바꾸는 값이다. */
  phone: string;
}

// Figma는 "26.0.1 · 최신버전"처럼 한 줄로 보여 주지만, 버전과 최신 여부는 서버가 내려 주는
// 별개 값이라 나눠서 받는다 — 문구 조합은 화면이 한다.
export interface AppVersion {
  version: string;
  isLatest: boolean;
}
