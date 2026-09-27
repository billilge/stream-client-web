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

// 헤더 아래 Tool 영역(대여/반납·행사/신청내역 SegmentedControl, size="small" 32px)
export function SegmentedControlSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <Skeleton
      animation={animation}
      height="32px"
      radius="10px"
      variant="rectangle"
    />
  );
}

// FilterChipGroup 한 줄. 칩 폭은 실제 라벨 길이 대략값이다.
// 순서가 바뀌지 않는 정적 목록이라 key를 미리 붙여 둔다(index key는 noArrayIndexKey에 걸린다).
const FILTER_CHIPS = [
  { key: "chip-1", width: "48px" },
  { key: "chip-2", width: "72px" },
  { key: "chip-3", width: "72px" },
  { key: "chip-4", width: "60px" },
  { key: "chip-5", width: "72px" },
];

// 목록 스켈레톤의 행 key. 행 수만 필요하고 내용이 없어서 미리 만들어 둔다.
export const SKELETON_ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];

export function FilterChipsSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex gap-2 overflow-hidden">
      {FILTER_CHIPS.map(({ key, width }) => (
        <Skeleton
          animation={animation}
          height="32px"
          key={key}
          radius="9999px"
          variant="rectangle"
          width={width}
        />
      ))}
    </div>
  );
}

// 전용 스켈레톤이 없는 화면(홈·신청 흐름·준비 중 화면)의 기본 로딩 화면. 본문 모양은 화면마다
// 달라서 흉내 내지 않고, 헤더 자리만 채운다.
function ScreenSkeleton() {
  useScreenHeaderSkeleton();

  return null;
}

export default ScreenSkeleton;
