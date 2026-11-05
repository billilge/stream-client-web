import type { z } from "zod";

import type {
  adminNotificationListItemSchema,
  adminRentalSummarySchema,
  notificationListItemSchema,
} from "@/shared/entities/notifications/notificationsQueries";

// 알림 종류 — 아이콘·라벨이 종류마다 다르다. 빌릴게는 대여/반납 아이콘이 따로라 둘로 나눴다.
// 서버 NotificationType 이름을 이 종류로 바꾸는 표는 features/notifications/constants/notifications.ts에 있다.
export type NotificationType =
  | "billilgeRental"
  | "billilgeReturn"
  | "notices"
  | "feedbacks"
  | "events"
  | "lockers";

// 내 알림 한 건(GET /v1/app/notifications)
export type NotificationListItem = z.infer<typeof notificationListItemSchema>;

// 관리자 공용 알림 한 건(GET /v1/admin/notifications)
export type AdminNotificationListItem = z.infer<
  typeof adminNotificationListItemSchema
>;

// 관리자 알림이 가리키는 대여 기록의 지금 값
export type AdminRentalSummary = z.infer<typeof adminRentalSummarySchema>;
