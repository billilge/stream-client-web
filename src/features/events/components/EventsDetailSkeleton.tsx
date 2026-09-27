import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// EventsDetailScreen이 로딩되는 동안의 자리 — 정사각 Hero 이미지, 상태 뱃지·제목, 일시/장소/대상
// 정보 행을 그대로 따른다. 실제 화면처럼 헤더 없이 Hero가 맨 위에서 시작하므로 헤더 슬롯은 비워 둔다.
function EventsDetailSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex-1 overflow-hidden bg-background-normal">
      <Skeleton
        animation={animation}
        className="aspect-square"
        radius="0"
        variant="rectangle"
      />
      <div className="flex flex-col gap-5 px-5 pt-5">
        <div className="flex flex-col gap-3">
          <Skeleton
            animation={animation}
            height="24px"
            radius="8px"
            variant="rectangle"
            width="64px"
          />
          <Skeleton
            animation={animation}
            height="28px"
            radius="6px"
            variant="rectangle"
            width="75%"
          />
        </div>
        <div className="flex flex-col gap-2">
          {SKELETON_ROW_KEYS.slice(0, 3).map((key) => (
            <Skeleton
              animation={animation}
              height="18px"
              key={key}
              radius="4px"
              variant="rectangle"
              width="65%"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventsDetailSkeleton;
