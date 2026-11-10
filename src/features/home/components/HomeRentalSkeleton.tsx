import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

const ROW_KEYS = ["rental-1", "rental-2"];

// 홈 대여 현황(반납 필요 대여)을 받는 동안 HomeRentalSection 자리에 보이는 스켈레톤 — 흰 카드 안에
// 제목 줄과 물품 두 줄(2건 Figma 3147:146269)의 배치를 따른다.
function HomeRentalSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Skeleton
        animation={animation}
        height="18px"
        radius="4px"
        variant="rectangle"
        width="30%"
      />
      <div className="flex flex-col gap-4">
        {ROW_KEYS.map((key) => (
          <div className="flex h-[42px] items-center gap-3" key={key}>
            <Skeleton
              animation={animation}
              height="42px"
              radius="10px"
              variant="rectangle"
              width="42px"
            />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton
                animation={animation}
                height="16px"
                radius="4px"
                variant="rectangle"
                width="40%"
              />
              <Skeleton
                animation={animation}
                height="14px"
                radius="4px"
                variant="rectangle"
                width="32%"
              />
            </div>
            <Skeleton
              animation={animation}
              height="32px"
              radius="8px"
              variant="rectangle"
              width="76px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeRentalSkeleton;
