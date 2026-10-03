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
