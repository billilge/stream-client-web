import bililgeRentalIcon from "@/assets/icons/notifications/bililge-rental.svg";
import bililgeReturnIcon from "@/assets/icons/notifications/bililge-return.svg";
import eventIcon from "@/assets/icons/notifications/event.svg";
import feedbackIcon from "@/assets/icons/notifications/feedback.svg";
import lockerIcon from "@/assets/icons/notifications/locker.svg";
import noticeIcon from "@/assets/icons/notifications/notice.svg";
import type { NotificationType } from "@/entities/notifications/types";

// Figma Notification Category — 24px 아이콘 + 라벨. 빌릴게는 대여·반납이 같은 라벨에 아이콘만 다르다.
export const NOTIFICATION_TYPE_META = {
  bililgeRental: { icon: bililgeRentalIcon, label: "빌릴게" },
  bililgeReturn: { icon: bililgeReturnIcon, label: "빌릴게" },
  events: { icon: eventIcon, label: "행사" },
  feedbacks: { icon: feedbackIcon, label: "열린피드백" },
  lockers: { icon: lockerIcon, label: "사물함" },
  notices: { icon: noticeIcon, label: "공지" },
} satisfies Record<NotificationType, { icon: string; label: string }>;

// 알림 설정 카테고리 — Figma 알림 설정(nodeId 3628:110837)의 행 순서다. 게시판은 공지·열린피드백을 같이 켜고 끈다.
export type NotificationSettingKey = "bililge" | "events" | "board" | "lockers";

export const NOTIFICATION_SETTINGS: {
  key: NotificationSettingKey;
  label: string;
  description: string;
}[] = [
  {
    description: "대여 진행 상황과 반납 일정을 알려 드려요",
    key: "bililge",
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
  bililge: true,
  board: false,
  events: false,
  lockers: false,
};

export const NOTIFICATIONS_PATH = "/notifications";
export const NOTIFICATIONS_SETTINGS_PATH = "/notifications/settings";
