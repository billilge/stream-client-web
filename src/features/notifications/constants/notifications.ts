import billilgeRentalIcon from "@/assets/icons/notifications/billilge-rental.svg";
import billilgeRentalRequestIcon from "@/assets/icons/notifications/billilge-rental-request.svg";
import billilgeReturnIcon from "@/assets/icons/notifications/billilge-return.svg";
import billilgeReturnRequestIcon from "@/assets/icons/notifications/billilge-return-request.svg";
import eventIcon from "@/assets/icons/notifications/event.svg";
import feedbackIcon from "@/assets/icons/notifications/feedback.svg";
import lockerIcon from "@/assets/icons/notifications/locker.svg";
import noticeIcon from "@/assets/icons/notifications/notice.svg";
import type { BillilgeRentalStatus } from "@/shared/entities/billilge/billilgeTypes";
import type { NotificationType } from "@/shared/entities/notifications/notificationsTypes";

// Figma Notification Category — 24px 아이콘 + 라벨. 빌릴게는 대여·반납이 같은 라벨에 아이콘만 다르다.
export const NOTIFICATION_TYPE_META = {
  billilgeRental: { icon: billilgeRentalIcon, label: "빌릴게" },
  billilgeReturn: { icon: billilgeReturnIcon, label: "빌릴게" },
  events: { icon: eventIcon, label: "행사" },
  feedbacks: { icon: feedbackIcon, label: "열린피드백" },
  lockers: { icon: lockerIcon, label: "사물함" },
  notices: { icon: noticeIcon, label: "공지" },
} satisfies Record<NotificationType, { icon: string; label: string }>;

// 서버 알림 종류(NotificationType 이름) → 화면 알림 종류. 반납 기한 알림(RENTAL_DUE_SOON·RENTAL_OVERDUE)은
// 반납하라는 알림이라 반납 아이콘을 쓴다. 여기 없는 종류(새로 생긴 종류)는 목록에서 뺀다.
// 열린피드백 답변 알림은 서버에 아직 종류가 없어서 feedbacks는 연결된 서버 종류가 없다.
export const NOTIFICATION_SERVER_TYPES: Record<string, NotificationType> = {
  EVENT_APPLIED: "events",
  EVENT_APPLICATION_CANCELED: "events",
  EVENT_STARTING_TOMORROW: "events",
  EVENT_APPLY_CLOSING: "events",
  LOCKER_ASSIGNED: "lockers",
  LOCKER_ASSIGNED_BY_ADMIN: "lockers",
  LOCKER_ASSIGNMENT_CANCELED: "lockers",
  LOCKER_APPLY_CLOSING: "lockers",
  LOCKER_USAGE_ENDING: "lockers",
  RENTAL_APPLY: "billilgeRental",
  RENTAL_APPROVED: "billilgeRental",
  RENTAL_REJECTED: "billilgeRental",
  RENTAL_DUE_SOON: "billilgeReturn",
  RENTAL_OVERDUE: "billilgeReturn",
  RETURN_APPLY: "billilgeReturn",
  RETURN_APPROVED: "billilgeReturn",
  RETURN_COMPLETED: "billilgeReturn",
  NOTICE_CREATED: "notices",
};

// 알림 설정 카테고리 — Figma 알림 설정(nodeId 3628:110837)의 행 순서다. 게시판은 공지·열린피드백을 같이 켜고 끈다.
export type NotificationSettingKey =
  | "billilge"
  | "events"
  | "board"
  | "lockers";

export const NOTIFICATION_SETTINGS: {
  key: NotificationSettingKey;
  label: string;
  description: string;
}[] = [
  {
    description: "대여 진행 상황과 반납 일정을 알려 드려요",
    key: "billilge",
    label: "빌릴게 알림",
  },
  {
    description: "진행 중인 행사와 신청 현황을 알려 드려요",
    key: "events",
    label: "행사 알림",
  },
  {
    description: "새 공지와 열린피드백 답변을 알려 드려요",
    key: "board",
    label: "게시판 알림",
  },
  {
    description: "배정 결과와 이용 기간 만료 임박을 알려 드려요",
    key: "lockers",
    label: "사물함 알림",
  },
];

// Figma 초기 상태 — 빌릴게 알림만 켜져 있다. 실 API가 붙으면 서버에 저장된 값으로 바꾼다.
export const INITIAL_NOTIFICATION_SETTINGS: Record<
  NotificationSettingKey,
  boolean
> = {
  billilge: true,
  board: false,
  events: false,
  lockers: false,
};

export const NOTIFICATIONS_PATH = "/notifications";
export const NOTIFICATIONS_SETTINGS_PATH = "/notifications/settings";

// 알림함은 내 알림과 관리자 공용 알림함(관리자에게만 보인다)으로 나뉜다. 빌릴게·행사 탭처럼 경로로 나눠서
// 알림 설정에 다녀오거나 새로고침해도 탭이 유지되고, 관리자 업무 알림 푸시도 관리자 탭으로 바로 보낼 수 있다.
export const NOTIFICATIONS_TAB_PATHS = {
  mine: NOTIFICATIONS_PATH,
  admin: "/notifications/admin",
} as const;

export type NotificationsTab = keyof typeof NOTIFICATIONS_TAB_PATHS;

interface AdminNotificationAction {
  /** 문구 뒷부분 — "김스트림 님이 우산 대여를 신청했어요" */
  appliedText: string;
  /** 둘째 줄에 받으러 오는 시각을 쓰는지 — 대여 신청만 학생이 고른 수령 시각이 있다 */
  showsPickupTime: boolean;
  /** 반려·승인 버튼을 두는 상태(승인 전)와 완료 버튼을 두는 상태(승인 후). 나머지 상태면 처리가 끝나 숨긴다 */
  reviewStatus: BillilgeRentalStatus;
  handoverStatus: BillilgeRentalStatus;
  /** 버튼마다 바꿀 상태 — 반납 반려는 대응하는 상태가 없어서 대여 중(RENTAL)으로 되돌린다 */
  approveTo: BillilgeRentalStatus;
  rejectTo: BillilgeRentalStatus;
  completeTo: BillilgeRentalStatus;
  /** 승인한 뒤 물품을 건네거나 돌려받았을 때 누르는 버튼 */
  completeLabel: string;
  /** 반려 확인 모달 — 반려하면 어떻게 되는지 미리 알려 준다 */
  rejectTitle: string;
  rejectDescription: string;
}

// 관리자 알림 종류별(서버 NotificationType 이름) 아이콘·라벨과 처리 방법. 사용자 알림처럼 빌릴게 라벨을 쓰고,
// 대여·반납 신청만 반려 → 승인 → 완료 순서로 처리한다. 학생이 신청을 취소한 알림은 처리할 일이 없어 action이 없다.
// 대여 반려는 서버가 학생에게 "대여 신청이 반려되었어요" 알림(RENTAL_REJECTED)을 보내고, 반납 반려는 알림이 없다.
// 대여·반납 신청 아이콘은 Figma에 없어서 빌릴게 알림 박스(billilge-return.svg, 진파랑 #0066FF)의 손잡이 자리에
// 흰 화살표를 넣어 만들었다 — 꺼내 가는 대여는 위, 돌려놓는 반납은 아래다. 취소 알림은 화살표 없는 연한 박스 그대로다.
export const ADMIN_NOTIFICATION_TYPE_META: Record<
  string,
  { action: AdminNotificationAction | null; icon: string; label: string }
> = {
  ADMIN_RENTAL_APPLY: {
    action: {
      approveTo: "CONFIRMED",
      completeLabel: "대여 완료",
      completeTo: "RENTAL",
      appliedText: "대여를 신청했어요",
      handoverStatus: "CONFIRMED",
      rejectDescription: "반려하면 신청한 학생에게 알림이 가요.",
      rejectTitle: "대여 신청을 반려할까요?",
      rejectTo: "REJECTED",
      reviewStatus: "PENDING",
      showsPickupTime: true,
    },
    icon: billilgeRentalRequestIcon,
    label: "빌릴게",
  },
  ADMIN_RETURN_APPLY: {
    action: {
      approveTo: "RETURN_CONFIRMED",
      completeLabel: "반납 완료",
      completeTo: "RETURNED",
      appliedText: "반납을 신청했어요",
      handoverStatus: "RETURN_CONFIRMED",
      rejectDescription: "반려하면 다시 대여 중인 상태로 돌아가요.",
      rejectTitle: "반납 신청을 반려할까요?",
      rejectTo: "RENTAL",
      reviewStatus: "RETURN_PENDING",
      showsPickupTime: false,
    },
    icon: billilgeReturnRequestIcon,
    label: "빌릴게",
  },
  ADMIN_RENTAL_CANCEL: {
    action: null,
    icon: billilgeRentalIcon,
    label: "빌릴게",
  },
};

// 관리자 알림 처리 결과 안내
export const ADMIN_NOTIFICATION_TOASTS = {
  // 다른 관리자가 먼저 처리했거나 옛 화면에서 눌렀다(RENTAL_STATUS_CHANGED) — 목록은 다시 받는다
  statusChanged: "다른 관리자가 먼저 처리했어요.",
  failed: "처리하지 못했어요. 잠시 후 다시 시도해 주세요.",
} as const;
