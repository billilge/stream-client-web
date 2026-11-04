import { LOGIN_PATH } from "@/features/auth/constants/auth";

// 설정 화면들의 경로 — 홈 헤더·설정 화면이 같이 쓰므로 문자열을 흩지 않고 한곳에 둔다
// (알림의 `NOTIFICATIONS_PATH`와 같은 방식). 경로와 컴포넌트 이름의 형태를 맞춘다
// (`/withdrawal` ↔ `Withdrawal*`).
//
// `settings`는 용어 사전(terminology.md)에 없는 이름이다. 화면 묶음을 가리키는 말이라 폴더·라우트에만
// 쓰고, 데이터는 서버 회원 API(`/v1/app/members`)와 같은 `members` 도메인으로 뒀다
// (`shared/entities/members/`).
export const SETTINGS_PATHS = {
  phoneChange: "/settings/phone",
  root: "/settings",
  withdrawal: "/settings/withdrawal",
  withdrawalComplete: "/settings/withdrawal/complete",
};

// 로그아웃·회원 탈퇴로 계정을 떠난 뒤 나갈 곳 — 둘 다 로그아웃 상태라 로그인 화면으로 간다.
export const ACCOUNT_EXIT_PATH = LOGIN_PATH;

// 전화번호 변경 결과 토스트 — 문구와 색을 결과마다 한 번에 고른다(빌릴게 반납 신청의 RETURN_TOASTS와 같다).
// 성공 문구는 Figma 완료 토스트(3524:152457) 그대로고, 실패 두 문구는 Figma에 없어 정했다.
export const PHONE_CHANGE_TOASTS = {
  changed: { message: "전화번호를 변경했어요.", variant: "positive" },
  alreadyExists: {
    message: "이미 사용 중인 전화번호예요.",
    variant: "negative",
  },
  failed: {
    message: "전화번호 변경에 실패했어요. 다시 시도해 주세요.",
    variant: "negative",
  },
} as const;

export type PhoneChangeToast =
  (typeof PHONE_CHANGE_TOASTS)[keyof typeof PHONE_CHANGE_TOASTS];

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
