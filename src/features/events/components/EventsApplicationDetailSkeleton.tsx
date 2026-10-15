import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";
import { StatusSummaryCardSkeleton } from "@/components/ui/StatusSummaryCard";

const QUESTION_SKELETON_KEYS = ["question-1", "question-2", "question-3"];

// 신청내역 상세를 받는 동안 보이는 스켈레톤 — 행사 요약 카드와 문항 카드 배치만 따른다.
function EventsApplicationDetailSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 px-5">
      <StatusSummaryCardSkeleton badgeWidth="56px" rowWidths={["75%", "45%"]} />
      {QUESTION_SKELETON_KEYS.map((key) => (
        <div
          className="flex flex-col gap-3 rounded-xl bg-background-normal p-4"
          key={key}
        >
          <Skeleton
            animation={animation}
            height="22px"
            variant="text"
            width="55%"
          />
          <Skeleton
            animation={animation}
            height="20px"
            variant="text"
            width="40%"
          />
          <Skeleton
            animation={animation}
            height="20px"
            variant="text"
            width="40%"
          />
        </div>
      ))}
    </div>
  );
}

export default EventsApplicationDetailSkeleton;
