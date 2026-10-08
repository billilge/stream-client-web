import { Skeleton } from "@wanteddev/wds";

import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// WDS Skeleton의 깜빡임(2초 pulse)은 JS prop으로만 끌 수 있어서, 스켈레톤마다 이 값으로 넘긴다.
export function useSkeletonAnimation() {
  return !usePrefersReducedMotion();
}

// 상세 화면 ScreenHeader(variant="normal")와 같은 56px 자리에 좌상단 24px 뒤로가기 버튼 자리를 그린다.
// 헤더가 비어 있다가 실제 화면이 들어올 때 본문이 헤더 높이만큼 밀려 내려가지 않도록, 스켈레톤도 헤더 슬롯을 채운다.
function ScreenHeaderSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex h-14 items-center px-4">
      <Skeleton
        animation={animation}
        height="24px"
        radius="6px"
        variant="rectangle"
        width="24px"
      />
    </div>
  );
}

// 헤더가 데이터에 따라 달라지는 화면(공지 상세)의 스켈레톤이 헤더 슬롯을 채울 때 쓴다.
// 데이터가 오면 그 화면의 useScreenHeader가 덮어쓴다.
export function useScreenHeaderSkeleton() {
  useScreenHeader(<ScreenHeaderSkeleton />);
}

// 목록 스켈레톤의 행 key. 행 수만 필요하고 내용이 없어서 미리 만들어 둔다.
export const SKELETON_ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];
