import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage, IconReset } from "@wanteddev/wds-icon";
import type { ComponentType } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ComingSoonScreen from "@/app/ComingSoonScreen";
import sectionA1Photo from "@/assets/images/lockers/section-a-1-photo.jpg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersA1LockerMap from "@/features/lockers/components/LockersA1LockerMap";
import LockersA2LockerMap from "@/features/lockers/components/LockersA2LockerMap";
import LockersLockerLegend from "@/features/lockers/components/LockersLockerLegend";
import LockersLockerMinimap, {
  type LockersLockerMinimapViewport,
} from "@/features/lockers/components/LockersLockerMinimap";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import LockersSelectedLockerBar from "@/features/lockers/components/LockersSelectedLockerBar";
import {
  LOCKERS_A1_PHOTO_PINS,
  type LockersPhotoPin,
} from "@/features/lockers/constants/lockersLockers";

interface LockerMapProps {
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

interface SectionLayout {
  LockerMap: ComponentType<LockerMapProps>;
  photo?: { src: string; pins: LockersPhotoPin[] };
}

// 구역마다 칸 배치가 실제 공간 구조라 모양이 전부 달라서, 구역별 배치 컴포넌트를 둔다.
// 아직 Figma에 A-1·A-2만 있다.
const SECTION_LAYOUTS: Record<string, SectionLayout> = {
  "A-1": {
    LockerMap: LockersA1LockerMap,
    photo: { pins: LOCKERS_A1_PHOTO_PINS, src: sectionA1Photo },
  },
  "A-2": { LockerMap: LockersA2LockerMap },
};

// Figma: A-1구역 (nodeId 2159:110753), A-2구역 (2159:109533), A-1구역 실제사진 (2159:110174)
function LockersLockerSelectScreen() {
  const { sectionId = "" } = useParams();
  const layout = SECTION_LAYOUTS[sectionId];

  if (layout === undefined) {
    return <ComingSoonScreen />;
  }

  // 구역이 바뀌면 고른 칸·스크롤을 처음부터 다시 잡는다
  return (
    <SectionLockerSelect
      key={sectionId}
      layout={layout}
      sectionId={sectionId}
    />
  );
}

function SectionLockerSelect({
  sectionId,
  layout,
}: {
  sectionId: string;
  layout: SectionLayout;
}) {
  const navigate = useNavigate();
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<
    number | null
  >(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [viewport, setViewport] = useState<LockersLockerMinimapViewport | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const { LockerMap, photo } = layout;

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
          onClick={() => navigate(-1)}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title={`${sectionId}구역 사물함 선택`}
      trailing={
        <>
          {photo && (
            <TopNavigationButton
              aria-label="실제 사진 보기"
              onClick={() => setIsPhotoOpen(true)}
              variant="icon"
            >
              <IconImage />
            </TopNavigationButton>
          )}
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
    <LockerMap
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
        {/* 화면 끝까지 스크롤되도록 좌우 여백을 스크롤 영역 안쪽에 둔다 */}
        <div
          className="scrollbar-hidden shrink-0 overflow-x-auto pb-5"
          onScroll={updateViewport}
          ref={scrollRef}
        >
          <div className="w-max px-5">{map}</div>
        </div>
      </div>

      <LockersSelectedLockerBar
        // 신청 API가 아직 없어서 누를 곳만 열어둔다
        onSubmit={() => {}}
        sectionName={sectionId}
        selectedLockerNumber={selectedLockerNumber}
      />

      {photo && (
        <LockersSectionPhotoModal
          onClose={() => setIsPhotoOpen(false)}
          open={isPhotoOpen}
          photo={photo.src}
          pins={photo.pins}
          sectionName={sectionId}
        />
      )}
    </div>
  );
}

export default LockersLockerSelectScreen;
