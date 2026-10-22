import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 납부내역을 받는 동안 보이는 스켈레톤 — 납부 카드(배지 + 제목 + 3줄) 배치만 따른다.
function FeePaymentsSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col px-5">
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
          width="70%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="50%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="60%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="50%"
        />
      </div>
    </div>
  );
}

export default FeePaymentsSkeleton;
