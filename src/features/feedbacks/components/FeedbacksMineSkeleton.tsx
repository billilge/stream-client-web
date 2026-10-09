import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 작성내역을 받는 동안 목록 자리에 보이는 스켈레톤 — 카드(배지 + 내용 + 날짜) 배치만 따른다.
function FeedbacksMineSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 overflow-hidden px-5">
      {SKELETON_ROW_KEYS.slice(0, 3).map((key) => (
        <div
          className="flex flex-col gap-2 rounded-xl bg-background-normal p-4"
          key={key}
        >
          <Skeleton
            animation={animation}
            height="24px"
            radius="6px"
            variant="rectangle"
            width="56px"
          />
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
            width="64px"
          />
        </div>
      ))}
    </div>
  );
}

export default FeedbacksMineSkeleton;
