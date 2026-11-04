import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

const ROW_KEYS = ["event-1", "event-2"];

// 홈 데이터를 받는 동안 HomeAppliedEventSection 자리에 보이는 스켈레톤 — 흰 카드 안에 제목 줄과
// 행사 두 줄(이름·D-day)의 배치를 따른다.
function HomeAppliedEventSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Skeleton
        animation={animation}
        height="18px"
        radius="4px"
        variant="rectangle"
        width="24%"
      />
      {ROW_KEYS.map((key) => (
        <div className="flex flex-col gap-1.5" key={key}>
          <Skeleton
            animation={animation}
            height="16px"
            radius="4px"
            variant="rectangle"
            width="55%"
          />
          <Skeleton
            animation={animation}
            height="14px"
            radius="4px"
            variant="rectangle"
            width="22%"
          />
        </div>
      ))}
    </div>
  );
}

export default HomeAppliedEventSkeleton;
