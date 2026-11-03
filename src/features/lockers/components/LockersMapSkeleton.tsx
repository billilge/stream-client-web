import { Skeleton } from "@wanteddev/wds";

import {
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 칸 선택·위치 보기가 구역 상세를 받는 동안 보이는 스켈레톤 — 헤더(사진 버튼이 데이터에 따라 달라진다)와
// 미니맵 자리, 칸 배치 영역만 따른다.
function LockersMapSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-10 px-5">
      <div className="flex h-32 shrink-0 items-end">
        <Skeleton
          animation={animation}
          height="110px"
          radius="8px"
          variant="rectangle"
          width="60%"
        />
      </div>
      <Skeleton
        animation={animation}
        height="320px"
        radius="8px"
        variant="rectangle"
        width="100%"
      />
    </div>
  );
}

export default LockersMapSkeleton;
