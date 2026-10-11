import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const MAX_ZOOM = 3;
// 핀치를 끝낸 손가락이 칸을 누른 것으로 처리되지 않게 막는 시간
const CLICK_SUPPRESS_MS = 300;
const WHEEL_COMMIT_DELAY_MS = 150;

interface Point {
  x: number;
  y: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touches: TouchList) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY,
  );
}

function getTouchMidpoint(touches: TouchList): Point {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

// 칸 배치를 핀치·Ctrl+휠로 확대·축소한다(최소: 배치 전체가 화면 폭에 들어오는 배율, 최대 3배).
// transform: scale은 스크롤 영역 크기에 반영되지 않아서 CSS zoom을 쓴다. 제스처 중에는 리렌더 없이
// DOM에 바로 적용하고 끝나면 상태로 확정한다.
export function useLockersPinchZoom(
  scrollRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  onZoomChange?: () => void,
) {
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const minZoomRef = useRef(1);
  const onZoomChangeRef = useRef(onZoomChange);

  useLayoutEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useEffect(() => {
    const scroller = scrollRef.current;
    const content = contentRef.current;
    if (!scroller || !content) {
      return;
    }

    const toContentPoint = (anchor: Point): Point => ({
      x: (scroller.scrollLeft + anchor.x) / zoomRef.current,
      y: (scroller.scrollTop + anchor.y) / zoomRef.current,
    });
    const toAnchor = (clientPoint: Point): Point => {
      const rect = scroller.getBoundingClientRect();
      return { x: clientPoint.x - rect.left, y: clientPoint.y - rect.top };
    };

    const zoomAround = (nextZoom: number, anchor: Point, point: Point) => {
      let clamped = clamp(nextZoom, minZoomRef.current, MAX_ZOOM);
      content.style.zoom = String(clamped);
      // zoom은 길이마다 반올림돼서 최소 배율에서도 1~2px 넘칠 수 있다
      if (
        clamped === minZoomRef.current &&
        scroller.scrollWidth > scroller.clientWidth
      ) {
        minZoomRef.current *= scroller.clientWidth / scroller.scrollWidth;
        clamped = minZoomRef.current;
        content.style.zoom = String(clamped);
      }
      zoomRef.current = clamped;
      scroller.scrollLeft = point.x * clamped - anchor.x;
      scroller.scrollTop = point.y * clamped - anchor.y;
      onZoomChangeRef.current?.();
    };

    const updateMinZoom = () => {
      const naturalWidth =
        content.getBoundingClientRect().width / zoomRef.current;
      minZoomRef.current = Math.min(1, scroller.clientWidth / naturalWidth);
      if (zoomRef.current < minZoomRef.current) {
        zoomAround(
          minZoomRef.current,
          { x: 0, y: 0 },
          toContentPoint({ x: 0, y: 0 }),
        );
        setZoom(zoomRef.current);
      }
    };

    let pinch: { distance: number; zoom: number; point: Point } | null = null;
    let suppressClickUntil = 0;
    let wheelCommitTimer: number | undefined;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) {
        return;
      }
      pinch = {
        distance: getTouchDistance(event.touches),
        point: toContentPoint(toAnchor(getTouchMidpoint(event.touches))),
        zoom: zoomRef.current,
      };
      suppressClickUntil = Number.POSITIVE_INFINITY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!pinch || event.touches.length !== 2) {
        return;
      }
      event.preventDefault();
      zoomAround(
        (pinch.zoom * getTouchDistance(event.touches)) / pinch.distance,
        toAnchor(getTouchMidpoint(event.touches)),
        pinch.point,
      );
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!pinch || event.touches.length >= 2) {
        return;
      }
      pinch = null;
      suppressClickUntil = performance.now() + CLICK_SUPPRESS_MS;
      setZoom(zoomRef.current);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (performance.now() < suppressClickUntil) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      // 트랙패드 핀치는 Ctrl+휠로 들어온다
      if (!event.ctrlKey) {
        return;
      }
      event.preventDefault();
      const anchor = toAnchor({ x: event.clientX, y: event.clientY });
      zoomAround(
        zoomRef.current * Math.exp(-event.deltaY * 0.01),
        anchor,
        toContentPoint(anchor),
      );
      window.clearTimeout(wheelCommitTimer);
      wheelCommitTimer = window.setTimeout(
        () => setZoom(zoomRef.current),
        WHEEL_COMMIT_DELAY_MS,
      );
    };

    updateMinZoom();
    const resizeObserver = new ResizeObserver(updateMinZoom);
    resizeObserver.observe(scroller);

    scroller.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    // 페이지 확대를 preventDefault로 막아야 해서 passive가 아니다
    scroller.addEventListener("touchmove", handleTouchMove, { passive: false });
    scroller.addEventListener("touchend", handleTouchEnd);
    scroller.addEventListener("touchcancel", handleTouchEnd);
    scroller.addEventListener("click", handleClickCapture, { capture: true });
    scroller.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(wheelCommitTimer);
      scroller.removeEventListener("touchstart", handleTouchStart);
      scroller.removeEventListener("touchmove", handleTouchMove);
      scroller.removeEventListener("touchend", handleTouchEnd);
      scroller.removeEventListener("touchcancel", handleTouchEnd);
      scroller.removeEventListener("click", handleClickCapture, {
        capture: true,
      });
      scroller.removeEventListener("wheel", handleWheel);
    };
  }, [scrollRef, contentRef]);

  // 처음에는 가운데부터 보여준다
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) {
      return;
    }
    scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
  }, [scrollRef]);

  return zoom;
}
