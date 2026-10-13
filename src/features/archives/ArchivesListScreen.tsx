import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ArchivesList from "@/features/archives/components/ArchivesList";
import ArchivesListSkeleton from "@/features/archives/components/ArchivesListSkeleton";
import ArchivesYearFilter from "@/features/archives/components/ArchivesYearFilter";
import { getSearchPath } from "@/features/search/constants/search";

// Figma: 아카이빙 목록 (nodeId 1276:95397)
// 연도 필터는 아직 거르지 않는다 — 연도별 조회는 실 API가 맡을 자리라 선택 상태만 표시한다.
function ArchivesListScreen() {
  const [year, setYear] = useState("2025");
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
        <ArchivesYearFilter onChange={setYear} value={year} />
        {/* 헤더·연도 필터는 데이터와 무관해서 바로 그리고, 카드 자리만 스켈레톤으로 채운다 */}
        <Suspense fallback={<ArchivesListSkeleton />}>
          <ArchivesList
            onSelect={(archiveId) =>
              navigate(`/archives/${archiveId}`, { viewTransition: true })
            }
          />
        </Suspense>
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default ArchivesListScreen;
