import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import emptyNotificationsIllustration from "@/assets/icons/notifications/empty-notifications.svg";
import EmptyState from "@/components/ui/EmptyState";
import NotificationsItem from "@/features/notifications/components/NotificationsItem";
import { NOTIFICATION_SERVER_TYPES } from "@/features/notifications/constants/notifications";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatTimeAgo } from "@/lib/date";
import {
  notificationsQueries,
  useMarkNotificationReadMutation,
} from "@/shared/entities/notifications/notificationsQueries";

// 내 알림 목록을 useSuspenseInfiniteQuery로 이어 받는 데이터 컴포넌트 — 첫 페이지를 기다리는 동안은 바깥 Suspense가
// 스켈레톤을 보여준다. 화면이 모르는 알림 종류는 그리지 않는다.
// 서버 알림은 제목과 본문으로 나뉘어 오지만 Figma 항목은 한 덩어리 문구라 한 줄로 이어 붙인다.
function NotificationsList() {
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...notificationsQueries.list(),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });
  const { mutate: markRead } = useMarkNotificationReadMutation();

  const visibleNotifications = notifications.filter(
    (notification) => NOTIFICATION_SERVER_TYPES[notification.type],
  );

  // 받은 페이지에 그릴 알림이 없어도 다음 페이지가 있으면 끝 요소가 보여서 이어 받는다 — 빈 화면은 끝까지 없을 때만
  if (visibleNotifications.length === 0 && !hasNextPage) {
    // Figma는 Empty State를 프레임 전체 높이 기준 가운데에 둔다 — 헤더(56px)만큼 올려서 맞춘다.
    return (
      <div className="flex flex-1 items-center justify-center pb-14">
        <EmptyState
          description="새로운 소식이 있으면 알려 드릴게요."
          illustration={emptyNotificationsIllustration}
          title="도착한 알림이 없어요"
        />
      </div>
    );
  }

  return (
    <div className="scrollbar-hidden flex flex-1 flex-col overflow-y-auto">
      {visibleNotifications.map((notification) => (
        <NotificationsItem
          isRead={notification.read}
          key={notification.notificationId}
          message={
            notification.body === null
              ? notification.title
              : `${notification.title} ${notification.body}`
          }
          onRead={() => {
            if (!notification.read) {
              markRead(notification.notificationId);
            }
          }}
          timeLabel={formatTimeAgo(notification.createdAt)}
          type={NOTIFICATION_SERVER_TYPES[notification.type]}
        />
      ))}
      <div className="shrink-0" ref={nextPageTriggerRef} />
    </div>
  );
}

export default NotificationsList;
