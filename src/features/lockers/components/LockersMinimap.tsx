import { type ReactNode, useLayoutEffect, useRef, useState } from "react";

/** 칸 배치 전체 대비 지금 보이는 영역(0~1 비율) */
export interface LockersMinimapViewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface LockersMinimapProps {
  /** 본문과 같은 칸 배치 — 축소해서 그린다 */
  children: ReactNode;
  /** 본문 칸 배치의 1배 기준 폭. 같은 폭으로 그려야 "fill" 상자 비율이 본문과 같다 */
  layoutWidth: number;
  viewport: LockersMinimapViewport;
  /** 스크롤이 없으면(전체가 보이면) 테두리를 숨긴다 */
  isScrollable: boolean;
}

// Figma 미니맵 상자 110px, 안쪽 여백 8px. 테두리(Highlight Overlay)는 상자보다 위아래로 9px씩 크다(128px).
const BOX_HEIGHT = 110;
const BOX_PADDING = 8;
const HIGHLIGHT_OVERHANG = 9;
const AREA_HEIGHT = BOX_HEIGHT + HIGHLIGHT_OVERHANG * 2;
// 테두리가 끝에 닿았는지 볼 때 반올림 오차를 봐준다
const EDGE_EPSILON = 0.001;

// Figma: Minimap (nodeId 2159:110757) — Stream 로컬
// Figma는 칸·글자를 따로 줄여 그렸지만, 본문 배치를 zoom으로 줄여 그린다(배치를 두 벌 관리하지 않고,
// 4px 글자가 브라우저 최소 글자 크기에 걸리지 않는다). 높이는 고정, 폭은 배치 비율에 맞추되 남은 폭을 넘지 않는다.
function LockersMinimap({
  children,
  layoutWidth,
  viewport,
  isScrollable,
}: LockersMinimapProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const [layoutHeight, setLayoutHeight] = useState(0);

  useLayoutEffect(() => {
    const area = areaRef.current;
    const content = contentRef.current;
    if (!area || !content) {
      return;
    }
    const update = () => {
      const currentScale = Number(content.style.zoom) || 1;
      const height = content.getBoundingClientRect().height / currentScale;
      setLayoutHeight(height);
      setScale(
        Math.min(
          (BOX_HEIGHT - BOX_PADDING * 2) / height,
          (area.clientWidth - BOX_PADDING * 2) / layoutWidth,
        ),
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(area);
    return () => observer.disconnect();
  }, [layoutWidth]);

  const innerWidth = layoutWidth * (scale ?? 0);
  const innerHeight = layoutHeight * (scale ?? 0);
  const boxWidth = innerWidth + BOX_PADDING * 2;
  const contentTop = HIGHLIGHT_OVERHANG + BOX_PADDING;
  const right = viewport.left + viewport.width;
  const bottom = viewport.top + viewport.height;

  // 끝에 닿은 쪽은 Figma처럼 상자 밖(가로는 상자 끝, 세로는 9px 바깥)까지 늘린다
  const highlightLeft =
    viewport.left <= EDGE_EPSILON
      ? 0
      : BOX_PADDING + viewport.left * innerWidth;
  const highlightRight =
    right >= 1 - EDGE_EPSILON ? boxWidth : BOX_PADDING + right * innerWidth;
  const highlightTop =
    viewport.top <= EDGE_EPSILON ? 0 : contentTop + viewport.top * innerHeight;
  const highlightBottom =
    bottom >= 1 - EDGE_EPSILON
      ? AREA_HEIGHT
      : contentTop + bottom * innerHeight;

  return (
    <div
      aria-hidden
      className="relative min-w-0 flex-1"
      ref={areaRef}
      style={{
        height: AREA_HEIGHT,
        visibility: scale === null ? "hidden" : undefined,
      }}
    >
      <div
        className="absolute left-0 overflow-hidden rounded-lg bg-cool-neutral-97"
        style={{
          height: BOX_HEIGHT,
          padding: BOX_PADDING,
          top: HIGHLIGHT_OVERHANG,
          width: boxWidth,
        }}
      >
        {/* 축소본 안의 칸 버튼이 Tab·스크린리더에 두 번 잡히지 않게 막는다 */}
        <div
          inert
          ref={contentRef}
          style={{ width: layoutWidth, zoom: scale ?? 1 }}
        >
          {children}
        </div>
      </div>
      {isScrollable && (
        <div
          className="absolute rounded-[2px] border border-label-strong"
          style={{
            height: highlightBottom - highlightTop,
            left: highlightLeft,
            top: highlightTop,
            width: highlightRight - highlightLeft,
          }}
        />
      )}
    </div>
  );
}

export default LockersMinimap;
