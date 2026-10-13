// 설정 화면들의 경로 — 홈 헤더·설정 화면이 같이 쓰므로 문자열을 흩지 않고 한곳에 둔다
// (알림의 `NOTIFICATIONS_PATH`와 같은 방식).
export const SETTINGS_PATHS = {
  phoneChange: "/settings/phone",
  root: "/settings",
  withdrawal: "/settings/withdraw",
  withdrawalComplete: "/settings/withdraw/complete",
};

// Figma: 설정 화면 계정 정보(nodeId 3524:152331)·앱 버전(3524:152356) 목데이터 — 실 API 연동
// 전까지 사용. 전화번호 변경 화면은 아직 이 상수를 고치지 않아서, 번호를 바꿔도 설정 화면
// 값은 그대로다(연동할 때 함께 처리한다).
export const SETTINGS_ACCOUNT = {
  email: "pog454@kookmin.ac.kr",
  name: "이예담",
  phone: "010-1234-5678",
};

// 로그아웃·회원 탈퇴로 계정을 떠난 뒤 나갈 곳. 둘 다 로그아웃된 상태라 로그인/온보딩으로 가야
// 하는데 그 화면이 아직 없어서(#110에서 들어온다) 지금은 홈으로 보낸다. 인증이 붙으면 이 값을
// "/auth"로 바꾸고, 로그인 표시를 지우는 처리를 두 호출부(SettingsScreen 로그아웃 확인 모달,
// WithdrawalCompleteScreen)에 같이 붙이면 된다 — 지금은 지울 표시 자체가 없다.
export const ACCOUNT_EXIT_PATH = "/";

// Figma 표기 그대로("26.0.1 · 최신버전") — 최신 여부 판정은 서버 응답을 그대로 보여주는 자리다.
export const APP_VERSION_LABEL = "26.0.1 · 최신버전";

// 의견 보내기·개인정보 처리방침은 화면을 따로 만들지 않고 구글폼으로 연결한다. 폼 주소가 아직
// 없어서 빈 문자열로 두고, 값이 채워졌을 때만 새 탭으로 열도록 호출부에서 분기한다.
export const SETTINGS_EXTERNAL_LINKS = {
  feedbackForm: "",
  privacyPolicy: "",
};

interface WithdrawalNotice {
  id: string;
  title: string;
  description: string;
}

// Figma: 탈퇴 확인 페이지 Withdrawal Notice List(nodeId 3524:152481) 순서·문구 그대로.
// 렌더마다 배열을 다시 만들지 않도록 모듈 스코프 상수로 둔다.
export const WITHDRAWAL_NOTICES: WithdrawalNotice[] = [
  {
    description:
      "탈퇴 시 계정 및 회원 정보가 삭제되며, 삭제된 정보는 다시 복구할 수 없어요.",
    id: "account-deletion",
    title: "회원 정보가 삭제돼요",
  },
  {
    description:
      "신청 중인 행사나 이용 중인 복지 서비스가 있다면 탈퇴 후 이용이 어려울 수 있어요.",
    id: "active-services",
    title: "이용 내역을 확인해 주세요",
  },
  {
    description:
      "탈퇴 전에 작성한 열린피드백은 탈퇴 후에도 삭제되지 않고 유지돼요.",
    id: "feedback-retained",
    title: "작성한 열린피드백은 남아 있어요",
  },
  {
    description:
      "탈퇴 후 재가입하더라도 기존 계정의 활동 및 이용 내역은 다시 불러올 수 없어요.",
    id: "records-not-restored",
    title: "다시 가입해도 이전 기록은 복구되지 않아요",
  },
];
