import { TopNavigation, TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenLayout from "@/components/ui/ScreenLayout";
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

  return (
    <ScreenLayout
      hasBottomNav={false}
      header={
        // ScreenLayout 기본 배경은 alternative(회색)라, Figma의 흰 배경(Background/Normal/Normal)을 화면이 직접 깐다.
        <div className="bg-background-normal">
          <TopNavigation
            background={false}
            leadingContent={
              <TopNavigationButton
                aria-label="뒤로 가기"
                onClick={() => navigate(-1)}
                variant="icon"
              >
                <IconChevronLeft />
              </TopNavigationButton>
            }
            trailingContent={
              <TopNavigationButton aria-label="검색" variant="icon">
                <IconSearch />
              </TopNavigationButton>
            }
          >
            아카이빙
          </TopNavigation>
        </div>
      }
    >
      {/* pb-[34px]: 본문 위에 겹쳐 뜨는 홈 인디케이터에 마지막 카드가 가리지 않도록 */}
      <div className="flex min-h-full flex-col gap-4 bg-background-normal px-5 pb-[34px]">
        <ArchivesYearFilter onChange={setYear} value={year} />
        <div className="flex gap-2">
          {renderColumn(leftItems, LEFT_COLUMN_SIZES)}
          {renderColumn(rightItems, RIGHT_COLUMN_SIZES)}
        </div>
      </div>
    </ScreenLayout>
  );
}

export default ArchivesListScreen;
