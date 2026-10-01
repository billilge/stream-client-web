import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage, IconReset } from "@wanteddev/wds-icon";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ComingSoonScreen from "@/app/ComingSoonScreen";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLockerLegend from "@/features/lockers/components/LockersLockerLegend";
import LockersLockerMinimap, {
  type LockersLockerMinimapViewport,
} from "@/features/lockers/components/LockersLockerMinimap";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import LockersSelectedLockerBar from "@/features/lockers/components/LockersSelectedLockerBar";
import {
  LOCKERS_SECTION_DETAILS,
  type LockersSectionDetail,
} from "@/features/lockers/constants/lockersSectionDetails";

// Figma: A-1구역 (nodeId 2159:110753), A-2구역 (2159:109533), A-1구역 실제사진 (2159:110174)
// 구역마다 다른 칸 배치는 구역 상세의 layout이 갖고, 이 화면은 그걸 렌더러로 그리기만 한다.
function LockersLockerSelectScreen() {
  const { sectionId = "" } = useParams();
  const detail = LOCKERS_SECTION_DETAILS[sectionId];

  if (detail === undefined) {
    return <ComingSoonScreen />;
  }

  // 구역이 바뀌면 고른 칸·스크롤을 처음부터 다시 잡는다
  return <SectionLockerSelect detail={detail} key={sectionId} />;
}

function SectionLockerSelect({ detail }: { detail: LockersSectionDetail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<
    number | null
  >(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [viewport, setViewport] = useState<LockersLockerMinimapViewport | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const lockers = useMemo(
    () =>
      new Map(detail.lockers.map((locker) => [locker.lockerNumber, locker])),
    [detail.lockers],
  );
  const selectedLocker =
    selectedLockerNumber === null
      ? undefined
      : lockers.get(selectedLockerNumber);

  // 칸 배치가 화면보다 넓을 때만 미니맵을 띄운다 — Figma도 화면에 다 들어오는 A-2는
  // 미니맵을 투명하게 숨겨 자리만 남겨뒀다.
  const updateViewport = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const { clientWidth, scrollLeft, scrollWidth } = el;
    setViewport(
      scrollWidth > clientWidth
        ? { size: clientWidth / scrollWidth, start: scrollLeft / scrollWidth }
        : null,
    );
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    updateViewport();
    const observer = new ResizeObserver(updateViewport);
    observer.observe(el);

    return () => observer.disconnect();
  }, [updateViewport]);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          // 구역 선택 화면에서 들어왔으면 그 기록으로 돌아간다. 주소로 바로 들어와 앱 안의 이전
          // 기록이 없으면(location.key === "default") 앱 밖으로 나가지 않게 구역 선택 화면으로 보낸다.
          onClick={() =>
            location.key === "default"
              ? navigate("/lockers/apply/sections", { replace: true })
              : navigate(-1)
          }
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title={`${detail.section}구역 사물함 선택`}
      trailing={
        <>
          <TopNavigationButton
            aria-label="실제 사진 보기"
            onClick={() => setIsPhotoOpen(true)}
            variant="icon"
          >
            <IconImage />
          </TopNavigationButton>
          <TopNavigationButton
            aria-label="새로고침"
            // 구역 선택 화면과 같다 — 칸 현황 API가 붙으면 그 조회만 다시 하도록 바꾼다
            onClick={() => window.location.reload()}
            variant="icon"
          >
            <IconReset />
          </TopNavigationButton>
        </>
      }
      variant="normal"
    />,
  );

  const map = (
    <LockersLayoutRenderer
      layout={detail.layout}
      lockers={lockers}
      onSelect={setSelectedLockerNumber}
      selectedLockerNumber={selectedLockerNumber}
    />
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto">
        {/* Figma Minimap Section — 미니맵이 없어도 128px 자리를 지켜서 칸 배치 위치가 구역마다 같다 */}
        <div className="flex h-32 shrink-0 items-end justify-between px-5">
          {viewport ? (
            <LockersLockerMinimap viewport={viewport}>
              {map}
            </LockersLockerMinimap>
          ) : (
            <div />
          )}
          <LockersLockerLegend />
        </div>
        {/* 화면 끝까지 스크롤되도록 좌우 여백을 스크롤 영역 안쪽에 둔다.
            min-w-full: 화면에 다 들어오는 구역에서 layout의 "fill" 상자가 화면 폭까지 늘어나게 한다 */}
        <div
          className="scrollbar-hidden shrink-0 overflow-x-auto pb-5"
          onScroll={updateViewport}
          ref={scrollRef}
        >
          <div className="w-max min-w-full px-5">{map}</div>
        </div>
      </div>

      <LockersSelectedLockerBar
        // 신청 API가 아직 없어서 누를 곳만 열어둔다
        onSubmit={() => {}}
        lockerLabel={selectedLocker?.lockerLabel ?? null}
      />

      <LockersSectionPhotoModal
        layout={detail.layout}
        onClose={() => setIsPhotoOpen(false)}
        open={isPhotoOpen}
        photo={detail.photo}
        sectionName={detail.section}
      />
    </div>
  );
}

export default LockersLockerSelectScreen;
