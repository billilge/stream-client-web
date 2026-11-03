import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 줄 높이 합(18 + 4 + 20)을 실제 줄 42px과 맞춰 데이터가 들어올 때 시트가 튀지 않게 한다.
function LockersNoticeSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-6">
      {["usage", "one-per-person", "apply"].map((key) => (
        <div className="flex items-center gap-3" key={key}>
          <Skeleton
            animation={animation}
            height="42px"
            variant="circle"
            width="42px"
          />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton
              animation={animation}
              height="18px"
              variant="text"
              width="30%"
            />
            <Skeleton
              animation={animation}
              height="20px"
              variant="text"
              width="75%"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LockersNoticeSkeleton;
