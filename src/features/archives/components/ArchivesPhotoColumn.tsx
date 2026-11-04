import ArchivesPhotoCard, {
  type ArchivesPhotoCardSize,
} from "@/features/archives/components/ArchivesPhotoCard";
import { formatDate } from "@/lib/date";
import type { ArchiveListItemResponse } from "@/shared/entities/archives/archivesTypes";

interface ArchivesPhotoColumnProps {
  items: ArchiveListItemResponse[];
  /** 위에서부터 번갈아 적용할 카드 높이 — 두 열이 서로 다른 순서를 써서 높이가 엇갈린다 */
  sizes: ArchivesPhotoCardSize[];
  onItemClick: (item: ArchiveListItemResponse) => void;
}

// Figma: 아카이빙 목록 Photo Grid (nodeId 1276:95409)의 한 열.
// 2열 매스너리라 열마다 카드 높이 순서가 달라서, 열을 컴포넌트 단위로 둔다.
function ArchivesPhotoColumn({
  items,
  sizes,
  onItemClick,
}: ArchivesPhotoColumnProps) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {items.map((item, index) => (
        <ArchivesPhotoCard
          date={formatDate(item.startDate)}
          image={item.thumbnailUrl}
          key={item.archiveId}
          onClick={() => onItemClick(item)}
          size={sizes[index % sizes.length]}
          title={item.title}
        />
      ))}
    </div>
  );
}

export default ArchivesPhotoColumn;
