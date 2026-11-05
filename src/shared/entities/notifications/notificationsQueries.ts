import {
  type InfiniteData,
  infiniteQueryOptions,
  type QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api, type CursorSliceResponse } from "@/shared/api";
import { BILLILGE_RENTAL_STATUSES } from "@/shared/entities/billilge/billilgeQueries";
import { notificationsKeys } from "@/shared/entities/notifications/notificationsKeys";

const NOTIFICATIONS_PATH = "/v1/app/notifications";
const ADMIN_NOTIFICATIONS_PATH = "/v1/admin/notifications";

// 관리자 알림함은 처리가 끝난 알림을 화면에서 거르느라 한 페이지에 보일 게 적을 수 있어서 서버 상한(100)씩 받는다
const ADMIN_NOTIFICATIONS_PAGE_SIZE = 100;

// 알림 한 건(서버 NotificationListItemResponse). type은 서버 NotificationType 이름이다 — 새 종류가 생겨도
// 목록 전체가 깨지지 않게 문자열로 받고, 화면이 아는 종류만 그린다.
export const notificationListItemSchema = z.looseObject({
  notificationId: z.number(),
  type: z.string(),
  title: z.string(),
  // 한 문장짜리 알림은 본문이 없다
  body: z.string().nullable(),
  targetId: z.number().nullable(),
  read: z.boolean(),
  // KST 일시("2026-11-05T13:59:00.123456")
  createdAt: z.string(),
});

const notificationPageSchema = z.looseObject({
  content: z.array(notificationListItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullable(),
});

// 관리자 알림이 가리키는 대여 기록의 지금 값(서버 RentalSummary). 알림이 만들어진 시점 값이 아니다.
export const adminRentalSummarySchema = z.looseObject({
  rentalHistoryId: z.number(),
  // 물품이 삭제됐으면 null
  itemName: z.string().nullable(),
  // 물품이 삭제됐거나 이미지가 없으면 null
  itemImageUrl: z.string().nullable(),
  rentedCount: z.number(),
  // 탈퇴한 회원이면 서버가 "(탈퇴한 회원)"을 넣는다
  memberName: z.string(),
  // PENDING·CONFIRMED는 학생이 고른 희망 시각, RENTAL부터는 실제 수령 시각
  rentAt: z.string().nullable(),
  rentalStatus: z.enum(BILLILGE_RENTAL_STATUSES),
});

// 관리자 공용 알림 한 건(서버 AdminNotificationListItemResponse). title·body는 푸시 문구로 만들 때 고정되므로
// 화면의 대여 건 표시와 버튼은 rental로 고른다. 대여 알림이 아니거나 대여 기록이 지워졌으면 rental은 null이다.
export const adminNotificationListItemSchema =
  notificationListItemSchema.extend({
    rental: adminRentalSummarySchema.nullable(),
  });

const adminNotificationPageSchema = z.looseObject({
  content: z.array(adminNotificationListItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullable(),
});

type NotificationPage = z.infer<typeof notificationPageSchema>;

// 커서 목록의 다음 페이지 — 마지막 페이지면 null이라 더 받지 않는다
function getNextCursor(lastPage: CursorSliceResponse<unknown>) {
  return lastPage.hasNext ? lastPage.nextCursor : null;
}

// 읽음 처리한 알림을 받아 둔 페이지에서 바로 읽음으로 바꾼다 — 목록을 다시 받지 않아도 배경이 바로 바뀐다
function markReadInCache(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
  notificationId: number,
) {
  queryClient.setQueryData<InfiniteData<NotificationPage>>(
    queryKey,
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          content: page.content.map((notification) =>
            notification.notificationId === notificationId
              ? { ...notification, read: true }
              : notification,
          ),
        })),
      },
  );
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const notificationsQueries = {
  // 내 알림함을 최신순으로 이어 받는다(GET /v1/app/notifications)
  list: () =>
    infiniteQueryOptions({
      queryKey: notificationsKeys.list(),
      queryFn: async ({ pageParam, signal }) =>
        notificationPageSchema.parse(
          await api.get<unknown>(NOTIFICATIONS_PATH, {
            // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이 간다
            params: { cursor: pageParam },
            signal,
          }),
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 관리자 공용 알림함을 최신순으로 이어 받는다(GET /v1/admin/notifications) — 관리자 전체가 같은 목록과 읽음 상태를 본다
  adminList: () =>
    infiniteQueryOptions({
      queryKey: notificationsKeys.adminList(),
      queryFn: async ({ pageParam, signal }) =>
        adminNotificationPageSchema.parse(
          await api.get<unknown>(ADMIN_NOTIFICATIONS_PATH, {
            params: { cursor: pageParam, size: ADMIN_NOTIFICATIONS_PAGE_SIZE },
            signal,
          }),
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
};

// 내 알림 읽음 처리(PATCH /v1/app/notifications/{id}/read). 이미 읽은 알림이어도 서버는 성공으로 응답한다.
// 누르자마자 배경이 바뀌도록 받아 둔 목록을 먼저 고치고, 실패하면 목록을 다시 받아 서버 값으로 돌린다.
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      api.patch<null>(`${NOTIFICATIONS_PATH}/${notificationId}/read`),
    onMutate: (notificationId) =>
      markReadInCache(queryClient, notificationsKeys.list(), notificationId),
    onError: () =>
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list() }),
  });
}

// 관리자 공용 알림 읽음 처리(PATCH /v1/admin/notifications/{id}/read) — 누가 처리해도 관리자 전체가 읽음으로 본다
export function useMarkAdminNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      api.patch<null>(`${ADMIN_NOTIFICATIONS_PATH}/${notificationId}/read`),
    onMutate: (notificationId) =>
      markReadInCache(
        queryClient,
        notificationsKeys.adminList(),
        notificationId,
      ),
    onError: () =>
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.adminList(),
      }),
  });
}
