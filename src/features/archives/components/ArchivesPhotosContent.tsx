import { Typography } from "@wanteddev/wds";
import { use } from "react";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import { fetchArchive } from "@/entities/archives/archivesApi";

interface ArchivesPhotosContentProps {
  archiveId: string;
  onSelect: (photoIndex: number) => void;
}

// 현장 사진 목록 데이터를 받아 그리는 부분. 받는 동안은 ArchivesPhotosScreen의 Suspense가
// ArchivesPhotosSkeleton을 보여준다.
function ArchivesPhotosContent({
  archiveId,
  onSelect,
}: ArchivesPhotosContentProps) {
  const archive = use(fetchArchive(archiveId));

  if (!archive) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          존재하지 않는 아카이빙이에요
        </Typography>
      </div>
    );
  }

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      {/* pt-2: Figma Body gap(Top Navigation ↔ Photo Grid 8px) */}
      <div className="grid grid-cols-2 gap-2 px-5 pt-2 pb-4">
        {archive.photos.map((photo, index) => (
          <button
            className="overflow-hidden rounded-xl"
            // biome-ignore lint/suspicious/noArrayIndexKey: 같은 사진이 여러 장일 수 있고, 사진 목록은 순서가 바뀌지 않는다
            key={index}
            onClick={() => onSelect(index)}
            type="button"
          >
            {/* 버튼 안에 글자가 없어서 이 alt가 곧 버튼 이름이다(아카이빙 목록 카드는 제목·날짜가 그 역할을 한다) */}
            <img
              alt={`${archive.title} 현장 사진 ${index + 1}`}
              className="aspect-square w-full object-cover"
              decoding="async"
              loading="lazy"
              src={photo}
            />
          </button>
        ))}
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesPhotosContent;
