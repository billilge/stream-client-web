import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import type { ArchivesPhotoCardSize } from "@/features/archives/components/ArchivesPhotoCard";
import ArchivesPhotoColumn from "@/features/archives/components/ArchivesPhotoColumn";
import ArchivesYearFilter from "@/features/archives/components/ArchivesYearFilter";
import {
  ARCHIVES_ITEMS,
  type ArchivesItem,
} from "@/features/archives/constants/archivesItems";

// 2열 매스너리 — 왼쪽 열은 Large/Medium, 오른쪽 열은 Small/Large를 번갈아 써서 두 열의 카드 높이가 엇갈린다.
const LEFT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["large", "medium"];
const RIGHT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["small", "large"];

// Figma: 아카이빙 목록 (nodeId 1276:95397)
function ArchivesListScreen() {
  const [year, setYear] = useState("2025");
  const navigate = useNavigate();

  const leftItems = ARCHIVES_ITEMS.filter((_, index) => index % 2 === 0);
  const rightItems = ARCHIVES_ITEMS.filter((_, index) => index % 2 === 1);

  const handleItemClick = (item: ArchivesItem) => {
    navigate(`/archives/${item.id}`);
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="아카이빙"
      trailing={
        <TopNavigationButton aria-label="검색" variant="icon">
          <IconSearch />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 px-5 pb-4">
        <ArchivesYearFilter onChange={setYear} value={year} />
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
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesListScreen;
