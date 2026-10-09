import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 작성내역 상세를 받는 동안 보이는 스켈레톤 — 질문 머리·본문, 구분 띠, 답변 머리·본문 배치만 따른다.
function FeedbacksMineDetailSkeleton() {
  const animation = useSkeletonAnimation();

  const header = (
    <div className="flex items-center gap-2">
      <Skeleton
        animation={animation}
        height="32px"
        variant="circle"
        width="32px"
      />
      <div className="flex flex-col gap-1">
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="64px"
        />
        <Skeleton
          animation={animation}
          height="14px"
          variant="text"
          width="72px"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <div className="flex flex-col gap-3 px-5">
        {header}
        <Skeleton
          animation={animation}
          height="24px"
          variant="text"
          width="100%"
        />
      </div>
      <div className="h-2 w-full bg-background-alternative" />
      <div className="flex flex-col gap-3 px-5">
        {header}
        <Skeleton
          animation={animation}
          height="24px"
          variant="text"
          width="100%"
        />
        <Skeleton
          animation={animation}
          height="24px"
          variant="text"
          width="100%"
        />
        <Skeleton
          animation={animation}
          height="24px"
          variant="text"
          width="60%"
        />
      </div>
    </div>
  );
}

export default FeedbacksMineDetailSkeleton;
