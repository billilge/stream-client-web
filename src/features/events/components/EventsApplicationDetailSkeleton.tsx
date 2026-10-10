import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

const QUESTION_SKELETON_KEYS = ["question-1", "question-2", "question-3"];

// 신청내역 상세를 받는 동안 보이는 스켈레톤 — 행사 요약 카드와 문항 카드 배치만 따른다.
function EventsApplicationDetailSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 px-5">
      <div className="flex flex-col gap-2 rounded-xl bg-background-normal p-4">
        <Skeleton
          animation={animation}
          height="24px"
          radius="6px"
          variant="rectangle"
          width="56px"
        />
        <Skeleton
          animation={animation}
          height="28px"
          variant="text"
          width="60%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="75%"
        />
        <Skeleton
          animation={animation}
          height="18px"
          variant="text"
          width="45%"
        />
      </div>
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
