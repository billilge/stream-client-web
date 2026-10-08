import { Typography } from "@wanteddev/wds";

import type { NotificationType } from "@/entities/notifications/types";
import { NOTIFICATION_TYPE_META } from "@/features/notifications/constants/notifications";

interface NotificationsItemProps {
  type: NotificationType;
  message: string;
  timeLabel: string;
  isRead: boolean;
  onRead: () => void;
}

// Figma: Notification Item (nodeId 3595:107106 안 읽음 / 3595:107107 읽음) — Stream 로컬 컴포넌트.
// 안 읽은 알림만 Atomic/Blue/99 배경이고, 아이콘은 종류마다 색이 다를 뿐 읽음 여부와 상관없다.
// 설계 의도는 "탭하면 읽음 처리"까지다 — 관련 화면으로 이동하는 동작은 디자인에 없어서 넣지 않았다.
function NotificationsItem({
  type,
  message,
  timeLabel,
  isRead,
  onRead,
}: NotificationsItemProps) {
  const { icon, label } = NOTIFICATION_TYPE_META[type];

  return (
    <button
      className={`flex w-full items-start px-5 py-4 text-left ${
        isRead ? "" : "bg-notification-unread"
      }`}
      onClick={onRead}
      type="button"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img alt="" className="size-6 shrink-0" src={icon} />
            <Typography
              color="semantic.label.alternative"
              variant="caption1"
              weight="regular"
            >
              {label}
            </Typography>
          </div>
          <Typography
            color="semantic.label.alternative"
            variant="caption2"
            weight="regular"
          >
            {timeLabel}
          </Typography>
        </div>
        {/* 아이콘(24) + 간격(8) 만큼 들여 라벨과 같은 줄에서 시작하고, 오른쪽은 38px(pr-9.5) 비운다 */}
        <div className="pr-9.5 pl-8">
          <Typography
            color="semantic.label.normal"
            variant="label1-reading"
            weight="medium"
          >
            {!isRead && <span className="sr-only">안 읽은 알림. </span>}
            {message}
          </Typography>
        </div>
      </div>
    </button>
  );
}

export default NotificationsItem;
