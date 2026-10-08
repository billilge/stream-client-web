import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage, IconReset } from "@wanteddev/wds-icon";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ComingSoonScreen from "@/app/ComingSoonScreen";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SubmittingOverlay from "@/components/ui/SubmittingOverlay";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLockerLegend from "@/features/lockers/components/LockersLockerLegend";
import LockersLockerMinimap, {
  type LockersLockerMinimapViewport,
} from "@/features/lockers/components/LockersLockerMinimap";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import LockersSelectedLockerBar from "@/features/lockers/components/LockersSelectedLockerBar";
import { LOCKERS_APPLY_SUBMITTING_TEXT } from "@/features/lockers/constants/lockersApplySubmit";
import {
  LOCKERS_SECTION_DETAILS,
  type LockersSectionDetail,
} from "@/features/lockers/constants/lockersSectionDetails";
import { useLockersApplySubmit } from "@/features/lockers/hooks/useLockersApplySubmit";
import { useLockersPinchZoom } from "@/features/lockers/hooks/useLockersPinchZoom";

// 배치 영역 안쪽 여백(px-5, pb-5) — 미니맵에 보이는 영역을 배치 기준으로 계산할 때 뺀다
const CONTENT_PADDING = 20;

interface MinimapState {
  viewport: LockersLockerMinimapViewport;
  layoutWidth: number;
  isScrollable: boolean;
}

function clampRatio(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

// Figma: A-1구역 (nodeId 2159:110753), A-2구역 (2159:109533), A-1구역 실제사진 (2159:110174)
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isSubmitting, submit } = useLockersApplySubmit(detail.section);
  const [minimap, setMinimap] = useState<MinimapState | null>(null);
  const [scrollerWidth, setScrollerWidth] = useState<number>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const lockers = useMemo(
    () =>
      new Map(detail.lockers.map((locker) => [locker.lockerNumber, locker])),
    [detail.lockers],
  );
  const selectedLocker =
    selectedLockerNumber === null
      ? undefined
      : lockers.get(selectedLockerNumber);

  const updateViewport = useCallback(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) {
      return;
    }
    // 제스처 중에는 배율이 상태보다 앞서 DOM에만 반영돼 있어서 DOM 값을 읽는다
    const zoom = Number(content.style.zoom) || 1;
    const rect = content.getBoundingClientRect();
    const layoutWidth = rect.width / zoom - CONTENT_PADDING * 2;
    const layoutHeight = rect.height / zoom - CONTENT_PADDING;
    const visibleLeft = scroller.scrollLeft / zoom - CONTENT_PADDING;
    const visibleTop = scroller.scrollTop / zoom;
    const left = clampRatio(visibleLeft / layoutWidth);
    const top = clampRatio(visibleTop / layoutHeight);
    const right = clampRatio(
      (visibleLeft + scroller.clientWidth / zoom) / layoutWidth,
    );
    const bottom = clampRatio(
      (visibleTop + scroller.clientHeight / zoom) / layoutHeight,
    );

    setScrollerWidth(scroller.clientWidth);
    setMinimap({
      isScrollable:
        scroller.scrollWidth > scroller.clientWidth + 1 ||
        scroller.scrollHeight > scroller.clientHeight + 1,
      layoutWidth,
      viewport: { height: bottom - top, left, top, width: right - left },
    });
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

  const zoom = useLockersPinchZoom(scrollRef, contentRef, updateViewport);

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
      <div className="flex min-h-0 flex-1 flex-col gap-10">
        {/* Figma Minimap Section */}
        <div className="flex h-32 shrink-0 items-end gap-4 px-5">
          {minimap ? (
            <LockersLockerMinimap
              isScrollable={minimap.isScrollable}
              layoutWidth={minimap.layoutWidth}
              viewport={minimap.viewport}
            >
              {map}
            </LockersLockerMinimap>
          ) : (
            <div className="flex-1" />
          )}
          <LockersLockerLegend />
        </div>
        {/* touch-pan: 두 손가락 동작을 페이지 확대 대신 이 영역의 확대로 받는다.
            minWidth를 %가 아니라 px로 주는 이유: zoom을 걸면 %는 배율과 상관없이 화면 폭으로
            계산돼서, 화면보다 좁은 구역을 확대할 때 "fill" 상자가 비율대로 커지지 않는다 */}
        <div
          className="scrollbar-hidden min-h-0 flex-1 touch-pan-x touch-pan-y overflow-auto"
          onScroll={updateViewport}
          ref={scrollRef}
        >
          <div
            className="w-max px-5 pb-5"
            ref={contentRef}
            style={{ minWidth: scrollerWidth, zoom }}
          >
            {map}
          </div>
        </div>
      </div>

      <LockersSelectedLockerBar
        lockerLabel={selectedLocker?.lockerLabel ?? null}
        onSubmit={() => setIsConfirmOpen(true)}
      />

      <LockersSectionPhotoModal
        onClose={() => setIsPhotoOpen(false)}
        open={isPhotoOpen}
        photoUrl={detail.photoUrl}
        sectionName={detail.section}
      />

      {/* Figma: 사물함 선택 확인 모달 (nodeId 1737:218322) */}
      <ConfirmModal
        cancelLabel="수정"
        confirmLabel="신청하기"
        description="신청 후에는 변경할 수 없어요."
        highlight={selectedLocker?.lockerLabel}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          if (selectedLocker) {
            submit({
              lockerId: selectedLocker.lockerId,
              lockerLabel: selectedLocker.lockerLabel,
            });
          }
        }}
        open={isConfirmOpen}
        title="사물함을 신청할까요?"
      />

      <SubmittingOverlay
        description={LOCKERS_APPLY_SUBMITTING_TEXT.description}
        open={isSubmitting}
        title={LOCKERS_APPLY_SUBMITTING_TEXT.title}
      />
    </div>
  );
}

export default LockersLockerSelectScreen;
