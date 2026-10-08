import { Typography } from "@wanteddev/wds";

import emptyNotificationsIllustration from "@/assets/icons/notifications/empty-notifications.svg";

// Figma: 알림 empty state > Empty State (nodeId 3595:107512) — Stream 로컬 컴포넌트.
// 행사·검색 empty와 같은 뼈대(일러스트 80, 간격 12/4)에 일러스트·문구만 다르다.
// Figma 컨테이너 폭 203px은 가장 긴 문구("새로운 소식이 있으면 알려 드릴게요.")에 맞춘 값이라 고정하지 않고
// 문구 폭에 맡긴다 — 폰트 폭이 조금만 달라도 마지막 글자가 다음 줄로 넘어가기 때문이다.
function NotificationsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        alt=""
        className="size-20 shrink-0"
        src={emptyNotificationsIllustration}
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <Typography
          align="center"
          color="semantic.label.neutral"
          variant="headline1"
          weight="bold"
        >
          도착한 알림이 없어요
        </Typography>
        <Typography
          align="center"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          새로운 소식이 있으면 알려 드릴게요.
        </Typography>
      </div>
    </div>
  );
}

export default NotificationsEmptyState;
