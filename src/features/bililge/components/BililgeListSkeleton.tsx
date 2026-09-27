import { Skeleton } from "@wanteddev/wds";

import {
  FilterChipsSkeleton,
  SegmentedControlSkeleton,
  SKELETON_ROW_KEYS,
  useScreenHeaderSkeleton,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// BililgeListScreen이 로딩되는 동안의 자리 — 대여/반납 토글, 카테고리 칩, 물품 카드(BililgeItemCard)
// 배치를 그대로 따른다. 카드는 흰 면이라 회색 화면 배경 위에 실제 카드와 같은 흰 박스를 깔아 둔다.
function BililgeListSkeleton() {
  const animation = useSkeletonAnimation();
  useScreenHeaderSkeleton();

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-5">
        <SegmentedControlSkeleton />
      </div>
      <div className="shrink-0 px-5 py-4">
        <FilterChipsSkeleton />
      </div>
      <div className="flex flex-col gap-2 overflow-hidden px-5">
        {SKELETON_ROW_KEYS.map((key) => (
          <div
            className="flex h-[74px] items-center gap-3 rounded-xl bg-background-normal p-4"
            key={key}
          >
            <Skeleton
              animation={animation}
              height="42px"
              radius="8px"
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
                width="24%"
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

export default BililgeListSkeleton;
