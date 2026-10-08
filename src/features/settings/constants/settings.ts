// Figma: 설정 화면 계정 정보(nodeId 3013:116143)·앱 버전(3013:116176) 목데이터 — 실 API 연동
// 전까지 사용. 전화번호는 변경 화면에서 바꾸면 반영돼야 하는 값이라 화면 state의 초기값으로 쓴다.
export const SETTINGS_ACCOUNT = {
  email: "pog454@kookmin.ac.kr",
  name: "이예담",
  phone: "010-1234-5678",
};

// Figma 표기 그대로("26.0.1 · 최신버전") — 최신 여부 판정은 서버 응답을 그대로 보여주는 자리다.
export const APP_VERSION_LABEL = "26.0.1 · 최신버전";

// 의견 보내기·개인정보 처리방침은 화면을 따로 만들지 않고 구글폼으로 연결한다. 폼 주소가 아직
// 없어서 빈 문자열로 두고, 값이 채워졌을 때만 새 탭으로 열도록 호출부에서 분기한다.
export const SETTINGS_EXTERNAL_LINKS = {
  feedbackForm: "",
  privacyPolicy: "",
};

// 화면의 on/off state(Record)와 키를 맞추려고 id를 유니온으로 둔다 — 문자열로 두면 양쪽 중
// 한쪽에 오타가 나도 타입 에러가 안 난다.
export type NotificationCategoryId = "bililge" | "events" | "board" | "lockers";

interface NotificationCategory {
  id: NotificationCategoryId;
  title: string;
  description: string;
}

// Figma: 알림 설정 Category Notification List(nodeId 3013:116193) 순서·문구 그대로
export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    description: "대여 진행 상황과 반납 일정을 알려 드려요",
    id: "bililge",
    title: "빌릴게 알림",
  },
  {
    description: "진행 중인 행사와 신청 현황을 알려 드려요",
    id: "events",
    title: "행사 알림",
  },
  {
    description: "새 공지와 열린피드백 답변을 알려 드려요",
    id: "board",
    title: "게시판 알림",
  },
  {
    description: "배정 결과와 이용 기간 만료 임박을 알려 드려요",
    id: "lockers",
    title: "사물함 알림",
  },
];

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
