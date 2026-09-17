import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ArchivesPhotoCard, {
  type ArchivesPhotoCardSize,
} from "@/features/archives/components/ArchivesPhotoCard";
import ArchivesYearFilter from "@/features/archives/components/ArchivesYearFilter";
import {
  ARCHIVES_ITEMS,
  type ArchivesItem,
} from "@/features/archives/constants/archivesItems";

// 2열 매스너리 — 왼쪽 열은 Large/Medium, 오른쪽 열은 Small/Large를 번갈아 써서 두 열의 카드 높이가 엇갈린다.
const LEFT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["large", "medium"];
const RIGHT_COLUMN_SIZES: ArchivesPhotoCardSize[] = ["small", "large"];

function renderColumn(items: ArchivesItem[], sizes: ArchivesPhotoCardSize[]) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {items.map((item, index) => (
        <ArchivesPhotoCard
          date={item.date}
          image={item.image}
          key={item.id}
          size={sizes[index % sizes.length]}
          title={item.title}
        />
      ))}
    </div>
  );
}

// Figma: 아카이빙 상세 (nodeId 1276:95397)
function ArchivesListScreen() {
  const [year, setYear] = useState("2025");
  const navigate = useNavigate();

  const leftItems = ARCHIVES_ITEMS.filter((_, index) => index % 2 === 0);
  const rightItems = ARCHIVES_ITEMS.filter((_, index) => index % 2 === 1);

  useScreenHeader(
    // ScreenLayout 기본 배경은 alternative(회색)라, Figma의 흰 배경(Background/Normal/Normal)을 화면이 직접 깐다.
    <div className="bg-background-normal">
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
      />
    </div>,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto bg-background-normal">
      {/* sm:pb-[34px]: Figma 하단 Home Bar 여백 — 앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 둔다 */}
      <div className="flex flex-col gap-4 px-5 pb-4 sm:pb-[34px]">
        <ArchivesYearFilter onChange={setYear} value={year} />
        <div className="flex gap-2">
          {renderColumn(leftItems, LEFT_COLUMN_SIZES)}
          {renderColumn(rightItems, RIGHT_COLUMN_SIZES)}
        </div>
      </div>
    </div>
  );
}

export default ArchivesListScreen;
