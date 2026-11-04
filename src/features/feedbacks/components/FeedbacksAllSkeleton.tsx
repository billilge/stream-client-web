import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// "전체 피드백"을 받는 동안 보이는 스켈레톤 — 제목, 필터 칩 줄, 카드(질문 + 차수) 배치만 따른다.
function FeedbacksAllSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-4 overflow-hidden pb-24">
      <div className="flex flex-col gap-3 px-5">
        <Skeleton
          animation={animation}
          height="26px"
          variant="text"
          width="96px"
        />
        <Skeleton
          animation={animation}
          height="32px"
          radius="16px"
          variant="rectangle"
          width="200px"
        />
      </div>
      <div className="flex flex-col gap-3">
        {SKELETON_ROW_KEYS.slice(0, 4).map((key) => (
          <div className="flex flex-col gap-1 px-5 py-[7px]" key={key}>
            <Skeleton
              animation={animation}
              height="22px"
              variant="text"
              width="100%"
            />
            <Skeleton
              animation={animation}
              height="16px"
              variant="text"
              width="72px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbacksAllSkeleton;
