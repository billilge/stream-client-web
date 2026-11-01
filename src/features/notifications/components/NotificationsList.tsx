import { use, useState } from "react";

import emptyNotificationsIllustration from "@/assets/icons/notifications/empty-notifications.svg";
import EmptyState from "@/components/ui/EmptyState";
import { fetchNotifications } from "@/entities/notifications/notificationsApi";
import NotificationsItem from "@/features/notifications/components/NotificationsItem";

// 알림 목록 데이터를 use()로 읽는 데이터 컴포넌트 — 응답을 기다리는 동안은 바깥 Suspense가 스켈레톤을 보여준다.
// 읽음 처리는 서버 API가 없어서 이 화면 state로만 들고 있다(새로고침하면 목데이터 값으로 돌아간다).
function NotificationsList() {
  const notifications = use(fetchNotifications());
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());

  if (notifications.length === 0) {
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
      {notifications.map((notification) => (
        <NotificationsItem
          isRead={notification.isRead || readIds.has(notification.id)}
          key={notification.id}
          message={notification.message}
          onRead={() =>
            setReadIds((prev) => new Set(prev).add(notification.id))
          }
          timeLabel={notification.timeLabel}
          type={notification.type}
        />
      ))}
    </div>
  );
}

export default NotificationsList;
