import { Typography } from "@wanteddev/wds";

interface ArchivesPhotoGridProps {
  photos: string[];
}

const VISIBLE_PHOTO_COUNT = 3;

// Figma: 아카이빙 상세 Photo Grid (nodeId 1526:171246)
// 3장까지 보여주고, 더 있으면 마지막 칸을 어둡게 덮고 "N장 더보기"를 띄운다(N = 칸에 안 보이는 장수).
// 더보기 클릭 동작(전체 사진 화면)은 아직 디자인이 없어 표시만 한다.
function ArchivesPhotoGrid({ photos }: ArchivesPhotoGridProps) {
  const visiblePhotos = photos.slice(0, VISIBLE_PHOTO_COUNT);
  const hiddenCount = photos.length - (VISIBLE_PHOTO_COUNT - 1);
  const hasMore = photos.length > VISIBLE_PHOTO_COUNT;

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
          {hasMore && index === VISIBLE_PHOTO_COUNT - 1 && (
            <>
              <div className="absolute inset-0 bg-gradient-overlay/80" />
              <Typography
                as="p"
                color="semantic.static.white"
                sx={{ position: "relative" }}
                variant="caption1"
                weight="medium"
              >
                {hiddenCount}장 더보기
              </Typography>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ArchivesPhotoGrid;
