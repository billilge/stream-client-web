import { Skeleton } from "@wanteddev/wds";

import {
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 송금 퍼널에 들어올 때 내 납부 상태를 받는 동안 보이는 자리 — 첫 단계(남은 학기 수)의
// 두 줄 제목, 설명, 입력칸 배치를 따른다. 간격은 FeeTransferStepLayout(헤더 아래 12px, 본문 16px)과 같다.
function FeeTransferSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  return (
    <div className="flex h-full flex-col gap-4 bg-background-normal px-5 pt-3">
      <div className="flex flex-col gap-2">
        <Skeleton
          animation={animation}
          height="26px"
          radius="6px"
          variant="rectangle"
          width="60%"
        />
        <Skeleton
          animation={animation}
          height="26px"
          radius="6px"
          variant="rectangle"
          width="40%"
        />
        <Skeleton
          animation={animation}
          height="16px"
          radius="4px"
          variant="rectangle"
          width="70%"
        />
      </div>
      <Skeleton
        animation={animation}
        height="48px"
        radius="12px"
        variant="rectangle"
        width="100%"
      />
    </div>
  );
}

export default FeeTransferSkeleton;
