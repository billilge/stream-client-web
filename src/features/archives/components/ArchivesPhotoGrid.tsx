import { Typography } from "@wanteddev/wds";

interface ArchivesPhotoGridProps {
  photos: string[];
  onMoreClick: () => void;
}

// Figma Photo Grid는 칸이 3개다 — 3번째 칸은 "더보기" 오버레이로 덮인다.
const TILE_COUNT = 3;

// Figma: 아카이빙 상세 Photo Grid (nodeId 1526:171246)
// 3칸을 그리고, 사진이 더 있으면 마지막 칸을 어둡게 덮어 "N장 더보기"를 띄운다.
// N은 덮인 3번째 칸까지 포함한 "지금 못 보는 장수"다(26장이면 24장 더보기 — Figma와 같다).
// 더보기 칸을 누르면 전체 사진 화면으로 간다(onMoreClick).
function ArchivesPhotoGrid({ photos, onMoreClick }: ArchivesPhotoGridProps) {
  const visiblePhotos = photos.slice(0, TILE_COUNT);
  const hiddenCount = photos.length - (TILE_COUNT - 1);
  const hasMore = photos.length > TILE_COUNT;

  return (
    <div className="flex gap-2">
      {visiblePhotos.map((photo, index) => (
        <div
          className="relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-lg"
          // 같은 사진이 여러 장일 수 있어 순서로 구분한다
          // biome-ignore lint/suspicious/noArrayIndexKey: 사진 목록은 순서가 바뀌지 않는다
          key={index}
        >
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={photo}
          />
          {hasMore && index === TILE_COUNT - 1 && (
            <button
              className="absolute inset-0 flex items-center justify-center bg-gradient-overlay/80"
              onClick={onMoreClick}
              type="button"
            >
              <Typography
                as="span"
                color="semantic.static.white"
                variant="caption1"
                weight="medium"
              >
                {hiddenCount}장 더보기
              </Typography>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ArchivesPhotoGrid;
