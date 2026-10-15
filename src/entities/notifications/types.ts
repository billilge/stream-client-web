// 알림 종류 — 아이콘·라벨이 종류마다 다르다. 빌릴게는 대여/반납 아이콘이 따로라 둘로 나눴다.
export type NotificationType =
  | "bililgeRental"
  | "bililgeReturn"
  | "notices"
  | "feedbacks"
  | "events"
  | "lockers";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  /** 이미 포맷된 표시용 문자열 (예: "1시간 전") — 실 API가 시각을 주면 화면 쪽에서 상대 시간으로 바꾼다 */
  timeLabel: string;
  isRead: boolean;
}
