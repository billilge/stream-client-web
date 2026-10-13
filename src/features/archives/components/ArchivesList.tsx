import { Typography } from "@wanteddev/wds";
import { use } from "react";

import { fetchArchives } from "@/entities/archives/archivesApi";
import type { ArchiveItem } from "@/entities/archives/types";
import type { ArchivesPhotoCardSize } from "@/features/archives/components/ArchivesPhotoCard";
import ArchivesPhotoColumn from "@/features/archives/components/ArchivesPhotoColumn";

// 2열 매스너리 — 왼쪽 열은 Large/Medium, 오른쪽 열은 Small/Large를 번갈아 써서 두 열의 카드 높이가 엇갈린다.
const LEFT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["large", "medium"];
const RIGHT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["small", "large"];

interface ArchivesListProps {
  onSelect: (archiveId: string) => void;
}

// 아카이빙 목록 데이터를 받아 그리는 부분. 받는 동안은 ArchivesListScreen의 Suspense가
// ArchivesListSkeleton을 보여준다. 헤더·연도 필터는 데이터와 무관해서 화면이 바로 그린다.
function ArchivesList({ onSelect }: ArchivesListProps) {
  const archives = use(fetchArchives());

  if (archives.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          등록된 아카이빙이 없어요
        </Typography>
      </div>
    );
  }

  const leftItems = archives.filter((_, index) => index % 2 === 0);
  const rightItems = archives.filter((_, index) => index % 2 === 1);
  const handleItemClick = (item: ArchiveItem) => onSelect(item.id);

  return (
    <div className="flex gap-2">
      <ArchivesPhotoColumn
        items={leftItems}
        onItemClick={handleItemClick}
        sizes={LEFT_COLUMN_SIZES}
      />
      <ArchivesPhotoColumn
        items={rightItems}
        onItemClick={handleItemClick}
        sizes={RIGHT_COLUMN_SIZES}
      />
    </div>
  );
}

export default ArchivesList;
