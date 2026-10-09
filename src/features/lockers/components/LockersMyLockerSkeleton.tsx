import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 배정 정보를 받는 동안 보이는 스켈레톤 — 미니맵 자리와 칸 배치 영역만 따른다.
function LockersMyLockerSkeleton() {
  const animation = useSkeletonAnimation();

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

export default LockersMyLockerSkeleton;
