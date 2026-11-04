import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ArchivesList from "@/features/archives/components/ArchivesList";
import ArchivesListSkeleton from "@/features/archives/components/ArchivesListSkeleton";
import { getSearchPath } from "@/features/search/constants/search";

// Figma: 아카이빙 목록 (nodeId 1276:95397)
function ArchivesListScreen() {
  const [year, setYear] = useState<number | null>(null);
  const navigate = useNavigate();

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
        <TopNavigationButton
          aria-label="검색"
          onClick={() => navigate(getSearchPath("archives"))}
          variant="icon"
        >
          <IconSearch />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden flex-1 overflow-y-auto">
      <div className="flex flex-col gap-4 px-5 pb-4">
        <Suspense fallback={<ArchivesListSkeleton />}>
          <ArchivesList
            onYearChange={setYear}
            onSelect={(archiveId) =>
              navigate(`/archives/${archiveId}`, { viewTransition: true })
            }
            year={year}
          />
        </Suspense>
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesListScreen;
