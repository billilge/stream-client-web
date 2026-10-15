import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 현장 사진 목록을 받는 동안 보이는 스켈레톤 — 2열 정사각 격자 자리를 그대로 따른다.
// 첫 화면에 보이는 만큼만 그린다(아래쪽은 어차피 스크롤해야 보인다).
const SKELETON_TILE_KEYS = Array.from(
  { length: 8 },
  (_, index) => `tile-${index}`,
);

function ArchivesPhotosSkeleton() {
  const animation = useSkeletonAnimation();

  return (
    <div className="grid grid-cols-2 gap-2 overflow-hidden px-5 pt-2 pb-4">
      {SKELETON_TILE_KEYS.map((key) => (
        <Skeleton
          animation={animation}
          height="auto"
          key={key}
          radius="12px"
          sx={{ aspectRatio: "1 / 1" }}
          variant="rectangle"
          width="100%"
        />
      ))}
    </div>
  );
}

export default ArchivesPhotosSkeleton;
