import { Skeleton } from "@wanteddev/wds";

import {
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 모아보기를 받는 동안 보이는 스켈레톤 — 진행 바, 질문 머리·본문, 구분 띠, 답변 머리·본문 배치만 따른다.
// 헤더 제목(N차)이 데이터에 따라 정해져서 헤더 자리도 같이 채운다.
function FeedbacksDetailSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  const header = (
    <div className="flex items-center gap-2">
      <Skeleton
        animation={animation}
        height="32px"
        variant="circle"
        width="32px"
      />
      <Skeleton
        animation={animation}
        height="18px"
        variant="text"
        width="72px"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <div className="px-5 py-2">
        <Skeleton
          animation={animation}
          height="4px"
          radius="2px"
          variant="rectangle"
          width="100%"
        />
      </div>
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
          width="60%"
        />
      </div>
    </div>
  );
}

export default FeedbacksDetailSkeleton;
