import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 알림 목록 데이터를 받는 동안 NotificationsScreen의 목록 자리에 보이는 스켈레톤 — 헤더는 화면이 바로
// 그리므로 항목(아이콘·라벨·시간 줄 + 메시지 줄)의 배치만 따른다.
function NotificationsListSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col overflow-hidden">
      {SKELETON_ROW_KEYS.map((key) => (
        <div className="flex flex-col px-5 py-4" key={key}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton
                animation={animation}
                height="24px"
                radius="6px"
                variant="rectangle"
                width="24px"
              />
              <Skeleton
                animation={animation}
                height="14px"
                radius="4px"
                variant="rectangle"
                width="48px"
              />
            </div>
            <Skeleton
              animation={animation}
              height="12px"
              radius="4px"
              variant="rectangle"
              width="40px"
            />
          </div>
          <div className="pt-1 pr-9.5 pl-8">
            <Skeleton
              animation={animation}
              height="18px"
              radius="4px"
              variant="rectangle"
              width="85%"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationsListSkeleton;
