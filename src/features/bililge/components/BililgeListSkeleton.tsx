import { Skeleton } from "@wanteddev/wds";

import {
  SKELETON_ROW_KEYS,
  useSkeletonAnimation,
} from "@/components/ui/ScreenSkeleton";

// 대여 물품 데이터를 받는 동안 BililgeListScreen의 목록 자리에 보이는 스켈레톤 — 헤더·토글·필터는
// 화면이 바로 그리므로 물품 카드(BililgeItemCard) 배치만 따른다. 카드는 흰 면이라 회색 화면 배경 위에
// 실제 카드와 같은 흰 박스를 깔아 둔다.
function BililgeListSkeleton() {
  const animation = useSkeletonAnimation();

  return (
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
  );
}

export default BililgeListSkeleton;
