import { Skeleton } from "@wanteddev/wds";

import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// WDS Skeleton의 깜빡임(2초 pulse)은 JS prop으로만 끌 수 있어서, 스켈레톤마다 이 값으로 넘긴다.
export function useSkeletonAnimation() {
  return !usePrefersReducedMotion();
}

type ScreenHeaderSkeletonVariant = "display" | "normal";

// ScreenHeader와 같은 56px 자리에 그린다. 헤더가 비어 있다가 실제 화면이 들어올 때 본문이 헤더
// 높이만큼 밀려 내려가지 않도록, 스켈레톤도 헤더 슬롯을 채운다.
// display는 좌측 큰 타이틀, normal(상세 화면)은 좌상단 24px 뒤로가기 버튼 자리다.
function ScreenHeaderSkeleton({
  variant,
}: {
  variant: ScreenHeaderSkeletonVariant;
}) {
  const animation = useSkeletonAnimation();

  if (variant === "normal") {
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

  return (
    <div className="flex h-14 items-center px-5">
      <Skeleton
        animation={animation}
        height="28px"
        radius="8px"
        variant="rectangle"
        width="88px"
      />
    </div>
  );
}

// 화면 스켈레톤이 헤더 슬롯을 채울 때 쓴다. 실제 화면이 마운트되면 그 화면의 useScreenHeader가 덮어쓴다.
export function useScreenHeaderSkeleton(
  variant: ScreenHeaderSkeletonVariant = "display",
) {
  useScreenHeader(<ScreenHeaderSkeleton variant={variant} />);
}

// 목록 스켈레톤의 행 key. 행 수만 필요하고 내용이 없어서 미리 만들어 둔다.
export const SKELETON_ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

// 화면 JS를 받는 동안의 기본 로딩 화면(router.tsx의 lazyScreen). 본문 모양은 화면마다 달라서
// 흉내 내지 않고, 헤더 자리만 채운다 — 데이터 영역의 스켈레톤은 화면이 자기 Suspense로 그린다.
function ScreenSkeleton() {
  useScreenHeaderSkeleton();

  return null;
}

export default ScreenSkeleton;
