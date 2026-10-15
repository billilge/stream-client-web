import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 배정 상태를 받는 동안 보이는 스켈레톤 — 배정 요약 카드(배지 + 제목 + 2줄)와 사물함 카드 배치만 따른다.
function LockersAssignmentSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 px-5">
      <div className="flex flex-col gap-2 rounded-xl bg-background-normal p-4">
        <Skeleton
          animation={animation}
          height="24px"
          radius="6px"
          variant="rectangle"
          width="64px"
        />
        <Skeleton
          animation={animation}
          height="28px"
          variant="text"
          width="60%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="55%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="80%"
        />
      </div>
      <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="30%"
        />
        <Skeleton
          animation={animation}
          height="24px"
          variant="text"
          width="40%"
        />
        <Skeleton
          animation={animation}
          height="40px"
          radius="10px"
          variant="rectangle"
          width="100%"
        />
      </div>
    </div>
  );
}

export default LockersAssignmentSkeleton;
