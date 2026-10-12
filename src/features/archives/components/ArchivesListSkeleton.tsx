import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

// 목록 카드 높이(ArchivesPhotoCard의 large/medium/small)를 그대로 따라 두 열에 엇갈리게 둔다.
// key로 쓰려고 자리마다 이름을 붙여 둔다 — 내용이 없는 자리라 높이 말고는 구분할 값이 없다.
const LEFT_COLUMN_TILES = [
  { height: "258px", key: "left-1" },
  { height: "220px", key: "left-2" },
  { height: "258px", key: "left-3" },
];
const RIGHT_COLUMN_TILES = [
  { height: "184px", key: "right-1" },
  { height: "258px", key: "right-2" },
  { height: "220px", key: "right-3" },
];

function SkeletonColumn({
  tiles,
}: {
  tiles: { height: string; key: string }[];
}) {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-1 flex-col gap-2">
      {tiles.map(({ height, key }) => (
        <Skeleton
          animation={animation}
          height={height}
          key={key}
          radius="12px"
          variant="rectangle"
          width="100%"
        />
      ))}
    </div>
  );
}

// 아카이빙 목록 데이터를 받는 동안 보이는 스켈레톤 — 헤더·연도 필터는 화면이 바로 그리므로
// 2열 매스너리 카드 자리만 따른다.
function ArchivesListSkeleton() {
  return (
    <div className="flex gap-2">
      <SkeletonColumn tiles={LEFT_COLUMN_TILES} />
      <SkeletonColumn tiles={RIGHT_COLUMN_TILES} />
    </div>
  );
}

export default ArchivesListSkeleton;
