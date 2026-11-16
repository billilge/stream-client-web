import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// 당긴 거리의 절반만 따라 내려온다 — 손가락을 그대로 따라오면 살짝 끌어도 새로고침된다
const PULL_RESISTANCE = 0.5;
// 내용이 이만큼 내려온 채로 놓으면 새로고침한다. 새로고침하는 동안 로딩 표시가 이 높이로 떠 있다
const REFRESH_OFFSET = 56;
const MAX_PULL_OFFSET = 96;
// 손가락이 이만큼 움직이기 전에는 방향을 정하지 않는다 — 배너를 가로로 넘기는 손짓과 섞이지 않게 한다
const DIRECTION_LOCK_DISTANCE = 6;
const SETTLE_TRANSITION = "transform 200ms ease-out, height 200ms ease-out";

// 로딩 표시 높이와 스크롤 영역이 내려온 거리를 같이 맞춘다. 0이면 transform을 지워서 흔적을 남기지 않는다
function applyOffset(
  scroller: HTMLElement | null,
  indicator: HTMLElement | null,
  offset: number,
  animate: boolean,
) {
  for (const element of [scroller, indicator]) {
    if (element) {
      element.style.transition = animate ? SETTLE_TRANSITION : "";
    }
  }
  if (scroller) {
    scroller.style.transform = offset > 0 ? `translateY(${offset}px)` : "";
  }
  if (indicator) {
    indicator.style.height = `${offset}px`;
  }
}

// 홈 맨 위에서 아래로 당겼다 놓으면 onRefresh를 부른다(당겨서 새로고침). 로고를 눌렀을 때 쓰는 refresh도 같이 준다 —
// 맨 위로 올리고 같은 로딩 표시를 띄운 채 onRefresh가 끝나기를 기다린다.
// 스크롤 영역(헤더 포함)이 통째로 내려오고, 그 위로 드러나는 자리에 로딩 표시(indicatorRef)가 펼쳐진다.
// 당기는 동안은 리렌더 없이 DOM에 바로 적용하고(useLockersPinchZoom과 같은 방식), 새로고침 중인지만 상태로 둔다.
// 당기는 손짓은 touchmove를 preventDefault해서 브라우저 바운스로 넘기지 않는다 — React의 touch 핸들러는 passive라
// 막을 수 없어서 리스너를 직접 단다. Android Chrome의 당겨서 새로고침은 스크롤 영역의 overscroll-behavior로 막는다.
export function useHomePullToRefresh(onRefresh: () => Promise<unknown>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  useLayoutEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      return;
    }
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    scrollRef.current?.scrollTo({ top: 0 });
    applyOffset(scrollRef.current, indicatorRef.current, REFRESH_OFFSET, true);
    try {
      await onRefreshRef.current();
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
      applyOffset(scrollRef.current, indicatorRef.current, 0, true);
    }
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) {
      return;
    }

    let gesture: {
      startX: number;
      startY: number;
      isPulling: boolean;
    } | null = null;
    let offset = 0;

    const handleTouchStart = (event: TouchEvent) => {
      // 맨 위가 아니거나 이미 새로고침 중이면 평소 스크롤로 둔다
      if (
        isRefreshingRef.current ||
        scroller.scrollTop > 0 ||
        event.touches.length !== 1
      ) {
        gesture = null;
        return;
      }
      gesture = {
        isPulling: false,
        startX: event.touches[0].clientX,
        startY: event.touches[0].clientY,
      };
      offset = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!gesture) {
        return;
      }
      const dx = event.touches[0].clientX - gesture.startX;
      const dy = event.touches[0].clientY - gesture.startY;
      if (!gesture.isPulling) {
        if (Math.hypot(dx, dy) < DIRECTION_LOCK_DISTANCE) {
          return;
        }
        // 가로로 넘기거나 위로 밀면(아래 내용 보기) 당기기가 아니다
        if (Math.abs(dx) > Math.abs(dy) || dy < 0) {
          gesture = null;
          return;
        }
        gesture.isPulling = true;
      }
      event.preventDefault();
      offset = Math.min(Math.max(dy, 0) * PULL_RESISTANCE, MAX_PULL_OFFSET);
      applyOffset(scroller, indicatorRef.current, offset, false);
    };

    const handleTouchEnd = () => {
      const wasPulling = gesture?.isPulling === true;
      gesture = null;
      if (!wasPulling) {
        return;
      }
      if (offset >= REFRESH_OFFSET) {
        void refresh();
      } else {
        applyOffset(scroller, indicatorRef.current, 0, true);
      }
    };

    scroller.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    scroller.addEventListener("touchmove", handleTouchMove, { passive: false });
    scroller.addEventListener("touchend", handleTouchEnd);
    scroller.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      scroller.removeEventListener("touchstart", handleTouchStart);
      scroller.removeEventListener("touchmove", handleTouchMove);
      scroller.removeEventListener("touchend", handleTouchEnd);
      scroller.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [refresh]);

  return { indicatorRef, isRefreshing, refresh, scrollRef };
}
