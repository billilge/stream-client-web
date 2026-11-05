import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import emptyNotificationsIllustration from "@/assets/icons/notifications/empty-notifications.svg";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ScreenToast from "@/components/ui/ScreenToast";
import NotificationsAdminItem, {
  type NotificationsAdminAction,
} from "@/features/notifications/components/NotificationsAdminItem";
import {
  ADMIN_NOTIFICATION_TOASTS,
  ADMIN_NOTIFICATION_TYPE_META,
} from "@/features/notifications/constants/notifications";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatMeridiemTime, formatMonthDay, formatTimeAgo } from "@/lib/date";
import { isApiError } from "@/shared/api";
import {
  BILLILGE_ERROR_CODES,
  useUpdateAdminRentalStatusMutation,
} from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeRentalStatus } from "@/shared/entities/billilge/billilgeTypes";
import {
  notificationsQueries,
  useMarkAdminNotificationReadMutation,
} from "@/shared/entities/notifications/notificationsQueries";
import type { AdminNotificationListItem } from "@/shared/entities/notifications/notificationsTypes";

type AdminNotificationStep = "review" | "handover";

// 대여 기록의 지금 상태로 버튼 단계를 고른다 — 승인 전이면 반려·승인, 승인 뒤면 완료. 그 밖의 상태(대여 중·반려·
// 취소·반납 완료 등)거나 대여 기록이 지워졌으면(rental null) 처리가 끝나 null이다.
function getStep(
  notification: AdminNotificationListItem,
): AdminNotificationStep | null {
  const action = ADMIN_NOTIFICATION_TYPE_META[notification.type]?.action;
  const status = notification.rental?.rentalStatus;
  if (!action || !status) {
    return null;
  }
  if (status === action.reviewStatus) {
    return "review";
  }
  return status === action.handoverStatus ? "handover" : null;
}

// 처리할 일만 남긴다 — 대여·반납 신청은 처리가 끝나기 전까지, 학생이 신청을 취소한 알림은 읽기 전까지만 보인다.
// 화면이 모르는 알림 종류는 그리지 않는다.
function isVisible(notification: AdminNotificationListItem) {
  const meta = ADMIN_NOTIFICATION_TYPE_META[notification.type];
  if (!meta) {
    return false;
  }
  return meta.action === null
    ? !notification.read
    : getStep(notification) !== null;
}

// 보내는 중인 상태 변경이 어느 버튼에서 왔는지 — 같은 종류 안에서 버튼마다 바꿀 상태가 다르다
function getPendingAction(
  action: { approveTo: BillilgeRentalStatus; rejectTo: BillilgeRentalStatus },
  rentalStatus: BillilgeRentalStatus,
): NotificationsAdminAction {
  if (rentalStatus === action.approveTo) {
    return "approve";
  }
  return rentalStatus === action.rejectTo ? "reject" : "complete";
}

// "YYYY-MM-DD" — 받으러 오는 날이 오늘인지 볼 때 쓴다
function getTodayDate(now: Date = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// 받으러 오는 시각 — 오늘이면 "오후 2:30", 다른 날이면 "11월 6일 오후 2:30"
function formatPickupTime(rentAt: string) {
  const time = formatMeridiemTime(rentAt);
  return rentAt.startsWith(getTodayDate())
    ? time
    : `${formatMonthDay(rentAt)} ${time}`;
}

// 문구는 대여 기록의 지금 값(rental)으로 만든다. 서버 title은 푸시 문구라 "김스트림(20231234) 님이 14:30에 우산 대여를
// 신청했어요." 한 문장인데, 화면은 누가 무엇을 했는지만 제목에 두고 받으러 오는 시각은 둘째 줄로 내린다.
// 대여 기록이 지워진 취소 알림만 rental이 없어서 서버 문구를 그대로 쓴다. 수량은 2개 이상일 때만 붙인다.
function getCopy(notification: AdminNotificationListItem) {
  const { rental } = notification;
  const action = ADMIN_NOTIFICATION_TYPE_META[notification.type]?.action;
  if (!rental) {
    return { body: notification.body, title: notification.title };
  }
  const item = `${rental.itemName ?? "삭제된 물품"}${
    rental.rentedCount > 1 ? ` ${rental.rentedCount}개` : ""
  }`;
  if (!action) {
    return {
      body: null,
      title: `${rental.memberName} 님이 ${item} 대여 신청을 취소했어요`,
    };
  }
  return {
    body:
      action.showsPickupTime && rental.rentAt
        ? `${formatPickupTime(rental.rentAt)}에 받으러 와요`
        : null,
    title: `${rental.memberName} 님이 ${item} ${action.appliedText}`,
  };
}

// 관리자 공용 알림함 목록 — 처리할 일만 남는 목록이다. 버튼 단계와 숨김은 서버가 실어 주는 대여 기록의 지금 상태
// (rental.rentalStatus)로 고르므로, 다른 관리자가 처리한 결과도 다시 받으면 그대로 반영된다.
// 서버는 처리가 끝난 알림까지 모두 주므로 한 페이지에 보일 게 적을 수 있다 — 끝 요소가 보이는 동안 다음 페이지를 이어 받는다.
function NotificationsAdminList() {
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...notificationsQueries.adminList(),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });
  const { mutate: markRead } = useMarkAdminNotificationReadMutation();
  const statusMutation = useUpdateAdminRentalStatusMutation();
  // 모달이 닫히는 동안에도 문구가 남아 있도록 대상은 지우지 않고 열림만 따로 둔다
  const [rejectTarget, setRejectTarget] =
    useState<AdminNotificationListItem | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>(
    ADMIN_NOTIFICATION_TOASTS.failed,
  );
  const [toastOpen, setToastOpen] = useState(false);
  // 토스트가 떠 있는 중에 다시 실패해도 스크린리더가 재안내하도록 매번 새로 마운트한다(PhoneChangeScreen과 같은 패턴)
  const [toastToken, setToastToken] = useState(0);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
    setToastToken((token) => token + 1);
  };

  // 화면에서 본 상태(expectedStatus)를 같이 보내서, 그사이 다른 관리자가 처리했으면 서버가 거절한다.
  // 처음 처리하는 알림은 읽음도 같이 보낸다 — 관리자 알림의 읽음은 관리자 전체가 공유한다.
  const changeStatus = (
    notification: AdminNotificationListItem,
    rentalStatus: BillilgeRentalStatus,
  ) => {
    const { rental } = notification;
    if (!rental) {
      return;
    }
    if (!notification.read) {
      markRead(notification.notificationId);
    }
    statusMutation.mutate(
      {
        expectedStatus: rental.rentalStatus,
        rentalHistoryId: rental.rentalHistoryId,
        rentalStatus,
      },
      {
        onError: (error) => {
          const isStatusChanged =
            isApiError(error) &&
            error.code === BILLILGE_ERROR_CODES.rentalStatusChanged;
          if (!isStatusChanged) {
            console.error(error);
          }
          showToast(
            isStatusChanged
              ? ADMIN_NOTIFICATION_TOASTS.statusChanged
              : ADMIN_NOTIFICATION_TOASTS.failed,
          );
        },
      },
    );
  };

  const visibleNotifications = notifications.filter(isVisible);
  const rejectAction = rejectTarget
    ? ADMIN_NOTIFICATION_TYPE_META[rejectTarget.type]?.action
    : null;

  return (
    <>
      {visibleNotifications.length === 0 && !hasNextPage ? (
        // 사용자 알림 빈 화면과 같은 자리 — 헤더(56px)만큼 올려서 프레임 가운데에 맞춘다
        <div className="flex flex-1 items-center justify-center pb-14">
          <EmptyState
            description="빌릴게 대여·반납 신청이 오면 알려 드릴게요."
            illustration={emptyNotificationsIllustration}
            title="처리할 신청이 없어요"
          />
        </div>
      ) : (
        <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
          {visibleNotifications.map((notification) => {
            const meta = ADMIN_NOTIFICATION_TYPE_META[notification.type];
            const step = getStep(notification);
            const { title, body } = getCopy(notification);
            const { variables } = statusMutation;
            const pendingAction =
              statusMutation.isPending &&
              meta.action &&
              variables &&
              variables.rentalHistoryId === notification.rental?.rentalHistoryId
                ? getPendingAction(meta.action, variables.rentalStatus)
                : null;

            return (
              <NotificationsAdminItem
                action={
                  meta.action && step
                    ? {
                        completeLabel: meta.action.completeLabel,
                        onAction: (nextAction) => {
                          if (!meta.action) {
                            return;
                          }
                          if (nextAction === "reject") {
                            setRejectTarget(notification);
                            setIsRejectOpen(true);
                            return;
                          }
                          changeStatus(
                            notification,
                            nextAction === "approve"
                              ? meta.action.approveTo
                              : meta.action.completeTo,
                          );
                        },
                        pendingAction,
                        step,
                      }
                    : null
                }
                body={body}
                icon={meta.icon}
                isRead={notification.read}
                key={notification.notificationId}
                label={meta.label}
                onRead={() => markRead(notification.notificationId)}
                timeLabel={formatTimeAgo(notification.createdAt)}
                title={title}
              />
            );
          })}
          <div className="shrink-0" ref={nextPageTriggerRef} />
        </div>
      )}

      <ConfirmModal
        cancelLabel="닫기"
        confirmLabel="반려하기"
        description={rejectAction?.rejectDescription}
        onCancel={() => setIsRejectOpen(false)}
        onConfirm={() => {
          if (rejectTarget && rejectAction) {
            changeStatus(rejectTarget, rejectAction.rejectTo);
          }
          setIsRejectOpen(false);
        }}
        open={isRejectOpen}
        title={rejectAction?.rejectTitle ?? ""}
        tone="negative"
      />
      <ScreenToast
        key={toastToken}
        message={toastMessage}
        onOpenChange={setToastOpen}
        open={toastOpen}
      />
    </>
  );
}

export default NotificationsAdminList;
