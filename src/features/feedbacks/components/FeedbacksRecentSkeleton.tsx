import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// "최근 피드백" 캐러셀을 받는 동안 보이는 스켈레톤 — 제목과 Q&A 카드 한 장 배치만 따른다.
function FeedbacksRecentSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <>
      <div className="flex flex-col gap-3 px-5 pt-2">
        <Skeleton
          animation={animation}
          height="26px"
          variant="text"
          width="96px"
        />
        <Skeleton
          animation={animation}
          height="148px"
          radius="12px"
          variant="rectangle"
          width="100%"
        />
      </div>
      <div className="my-8 h-2 w-full bg-background-alternative" />
    </>
  );
}

export default FeedbacksRecentSkeleton;
