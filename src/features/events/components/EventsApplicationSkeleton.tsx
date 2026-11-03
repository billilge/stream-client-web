import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";
import { EventsQuestionFieldSkeleton } from "@/features/events/components/EventsQuestionField";

const QUESTION_SKELETON_KEYS = ["question-1", "question-2", "question-3"];

// 신청서 양식을 받는 동안 보이는 스켈레톤 — 행사 요약 카드(EventsSummaryCard)와 문항 카드 배치만 따른다.
// 제출 버튼은 문항을 받아야 누를 수 있는지 정해져서 양식과 함께 뜬다.
function EventsApplicationSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-1 flex-col gap-2 px-5">
      <div className="flex flex-col gap-2 rounded-xl bg-background-normal p-4">
        <Skeleton
          animation={animation}
          height="28px"
          variant="text"
          width="50%"
        />
        <div className="flex flex-col gap-1.5">
          <Skeleton
            animation={animation}
            height="18px"
            variant="text"
            width="40%"
          />
          <Skeleton
            animation={animation}
            height="18px"
            variant="text"
            width="55%"
          />
        </div>
      </div>
      {QUESTION_SKELETON_KEYS.map((key) => (
        <EventsQuestionFieldSkeleton key={key} />
      ))}
    </div>
  );
}

export default EventsApplicationSkeleton;
