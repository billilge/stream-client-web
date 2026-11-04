import { useSuspenseQuery } from "@tanstack/react-query";
import { Typography } from "@wanteddev/wds";
import { useCallback } from "react";

import type { ArchivesPhotoCardSize } from "@/features/archives/components/ArchivesPhotoCard";
import ArchivesPhotoColumn from "@/features/archives/components/ArchivesPhotoColumn";
import ArchivesYearFilter from "@/features/archives/components/ArchivesYearFilter";
import { archivesQueries } from "@/shared/entities/archives/archivesQueries";
import type {
  ArchiveListItemResponse,
  ArchiveListResponse,
} from "@/shared/entities/archives/archivesTypes";

// 2열 매스너리 — 왼쪽 열은 Large/Medium, 오른쪽 열은 Small/Large를 번갈아 써서 두 열의 카드 높이가 엇갈린다.
const LEFT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["large", "medium"];
const RIGHT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["small", "large"];

interface ArchivesListProps {
  /** 고른 연도. 아직 안 골랐으면 null이고 가장 최근 연도를 보여준다 */
  year: number | null;
  onYearChange: (year: number) => void;
  onSelect: (archiveId: number) => void;
}

function toArchivesListView(
  response: ArchiveListResponse,
  year: number | null,
) {
  const selectedYear = year ?? response.years[0] ?? null;
  return {
    archives: response.archives.filter(
      (archive) => Number(archive.startDate.slice(0, 4)) === selectedYear,
    ),
    selectedYear,
    years: response.years,
  };
}

// 아카이빙 목록 데이터를 받아 그리는 부분. 받는 동안은 ArchivesListScreen의 Suspense가
// ArchivesListSkeleton을 보여준다. 연도 칩도 서버가 주는 연도로 만들어서 여기서 같이 그린다.
function ArchivesList({ year, onYearChange, onSelect }: ArchivesListProps) {
  const { data } = useSuspenseQuery({
    ...archivesQueries.list(),
    select: useCallback(
      (response: ArchiveListResponse) => toArchivesListView(response, year),
      [year],
    ),
  });
  const { archives, selectedYear, years } = data;

  if (selectedYear === null) {
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
  const handleItemClick = (item: ArchiveListItemResponse) =>
    onSelect(item.archiveId);

  return (
    <>
      <ArchivesYearFilter
        onChange={onYearChange}
        value={selectedYear}
        years={years}
      />
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
    </>
  );
}

export default ArchivesList;
