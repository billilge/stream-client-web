import { useSuspenseQuery } from "@tanstack/react-query";

import LazyImage from "@/components/ui/LazyImage";
import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ArchivesNotFound from "@/features/archives/components/ArchivesNotFound";
import { archivesQueries } from "@/shared/entities/archives/archivesQueries";

interface ArchivesPhotosContentProps {
  archiveId: number;
  onSelect: (photoIndex: number) => void;
}

// 현장 사진 목록 데이터를 받아 그리는 부분. 받는 동안은 ArchivesPhotosScreen의 Suspense가
// ArchivesPhotosSkeleton을 보여준다.
function ArchivesPhotosContent({
  archiveId,
  onSelect,
}: ArchivesPhotosContentProps) {
  const { data: archive } = useSuspenseQuery(archivesQueries.detail(archiveId));

  if (!archive) {
    return <ArchivesNotFound />;
  }

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      {/* pt-2: Figma Body gap(Top Navigation ↔ Photo Grid 8px) */}
      <div className="grid grid-cols-2 gap-2 px-5 pt-2 pb-4">
        {archive.images.map((image, index) => (
          <button
            className="overflow-hidden rounded-xl"
            key={image.fileId}
            onClick={() => onSelect(index)}
            type="button"
          >
            {/* 버튼 안에 글자가 없어서 이 alt가 곧 버튼 이름이다(아카이빙 목록 카드는 제목·날짜가 그 역할을 한다) */}
            <LazyImage
              alt={`${archive.title} 현장 사진 ${index + 1}`}
              className="aspect-square w-full"
              src={image.fileUrl}
            />
          </button>
        ))}
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesPhotosContent;
