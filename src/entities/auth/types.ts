// K-CONNECT 인증이 돌려주는 사용자 — 신규 사용자면 온보딩(연락처·약관)을 거친다.
export interface KConnectUser {
  /** K-CONNECT가 알려 준 이름 — 온보딩 인삿말에 쓴다 */
  name: string;
  isNewUser: boolean;
}

export interface OnboardingSubmission {
  name: string;
  phone: string;
  /** 선택 약관(정보 알림 수신) 동의 여부 — 필수 약관 둘은 동의해야만 여기까지 온다 */
  hasAgreedNotifications: boolean;
}
