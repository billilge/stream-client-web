import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 행사 데이터를 받는 동안 EventsDetailScreen에 보이는 자리 — 상태 뱃지·제목, 일시/장소/대상 정보 행을 따른다.
// 사진 유무는 행사마다 달라서 공지 상세 스켈레톤처럼 사진 자리 대신 헤더 자리를 그린다.
function EventsDetailSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  return (
    <div className="flex-1 overflow-hidden bg-background-normal">
      <div className="flex flex-col gap-5 px-5">
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
