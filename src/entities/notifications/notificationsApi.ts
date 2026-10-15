import { NOTIFICATIONS } from "@/entities/notifications/notificationsMock";
import type { NotificationItem } from "@/entities/notifications/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchNotifications(): Promise<NotificationItem[]> {
  return mockupApi("notifications", () => NOTIFICATIONS);
}
