import {
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import LockersLockerLegend from "@/features/lockers/components/LockersLockerLegend";
import LockersLockerMinimap, {
  type LockersLockerMinimapViewport,
} from "@/features/lockers/components/LockersLockerMinimap";
import { useLockersPinchZoom } from "@/features/lockers/hooks/useLockersPinchZoom";

// 배치 영역 안쪽 여백(px-5, pb-5) — 미니맵에 보이는 영역을 배치 기준으로 계산할 때 뺀다
const CONTENT_PADDING = 20;

interface MinimapState {
  viewport: LockersLockerMinimapViewport;
  layoutWidth: number;
  isScrollable: boolean;
}

interface LockersLockerMapViewProps {
  /** 칸 배치 — 본문과 미니맵에 같이 그린다 */
  map: ReactNode;
  /** 보기 전용(내 사물함 화면) — 범례를 내 칸 표시로 바꾸고, 처음에 내 칸이 보이게 스크롤한다 */
  isViewOnly?: boolean;
}

function clampRatio(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

// 칸 선택 화면과 내 사물함 화면이 같이 쓰는 칸 배치 영역 — 미니맵·범례와 확대·스크롤되는 본문.
function LockersLockerMapView({
  map,
  isViewOnly = false,
}: LockersLockerMapViewProps) {
  const [minimap, setMinimap] = useState<MinimapState | null>(null);
  const [scrollerWidth, setScrollerWidth] = useState<number>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // 확대 훅이 처음에 가운데로 맞춘 뒤에 돌아야 해서 훅 호출 아래에 둔다.
  // 내 칸이 화면 밖에 있으면 안쪽 여백까지 보이도록 필요한 만큼만 스크롤한다(가운데로 맞추진 않는다).
  // 미니맵에도 같은 칸이 있어서 본문 안에서만 찾는다.
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    const cell = contentRef.current?.querySelector("[data-my-locker]");
    if (!isViewOnly || !scroller || !cell) {
      return;
    }
    const scrollerRect = scroller.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const overflowRight = cellRect.right + CONTENT_PADDING - scrollerRect.right;
    const overflowLeft = scrollerRect.left - (cellRect.left - CONTENT_PADDING);
    const overflowBottom =
      cellRect.bottom + CONTENT_PADDING - scrollerRect.bottom;
    const overflowTop = scrollerRect.top - cellRect.top;
    if (overflowRight > 0) {
      scroller.scrollLeft += overflowRight;
    } else if (overflowLeft > 0) {
      scroller.scrollLeft -= overflowLeft;
    }
    if (overflowBottom > 0) {
      scroller.scrollTop += overflowBottom;
    } else if (overflowTop > 0) {
      scroller.scrollTop -= overflowTop;
    }
    updateViewport();
  }, [isViewOnly, updateViewport]);

  return (
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
        <LockersLockerLegend isViewOnly={isViewOnly} />
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
  );
}

export default LockersLockerMapView;
