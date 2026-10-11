import { useLayoutEffect, useRef } from "react";
import { useLocation, useMatches, useNavigationType } from "react-router-dom";

import ScreenLayout, {
  type ScreenBackground,
} from "@/components/ui/ScreenLayout";

// 화면별 레이아웃 옵션 — router.tsx의 각 라우트에 `handle: { ... } satisfies ScreenRouteHandle`로 지정한다.
// 모든 필드는 선택이고, 지정하지 않은 필드는 바깥 라우트의 값이나 기본값을 따른다.
export interface ScreenRouteHandle {
  hasBottomNav?: boolean;
  // 화면 프레임 자체의 배경 — 헤더 뒤까지 포함이라 화면 본문에서 칠할 수 없다.
  // 기본은 회색(alternative)이고, 완료 화면처럼 Figma가 흰 배경으로 그린 화면만 normal을 지정한다.
  background?: ScreenBackground;
}

// useMatches()는 handle을 unknown으로 준다. ScreenRouteHandle은 필드가 전부 선택이라 객체면 이 타입으로 본다.
function isScreenRouteHandle(handle: unknown): handle is ScreenRouteHandle {
  return typeof handle === "object" && handle !== null;
}

// 옵션 필드마다, 그 필드를 지정한 라우트 중 가장 안쪽 값을 고른다(handles는 바깥 → 안쪽 순서).
// 필드별로 따로 고르기 때문에 옵션이 늘어나도 한 라우트가 일부 필드만 지정할 수 있다.
function resolveScreenRouteOption<K extends keyof ScreenRouteHandle>(
  handles: ScreenRouteHandle[],
  key: K,
): ScreenRouteHandle[K] {
  for (const handle of [...handles].reverse()) {
    if (handle[key] !== undefined) {
      return handle[key];
    }
  }
  return undefined;
}

// createBrowserRouter는 history.state.idx에 히스토리 스택 위치를 적어 둔다(push마다 1씩 증가).
function getHistoryIndex(): number | null {
  const state: unknown = window.history.state;
  if (
    typeof state === "object" &&
    state !== null &&
    "idx" in state &&
    typeof state.idx === "number"
  ) {
    return state.idx;
  }
  return null;
}

// ScreenLayout은 라우터를 모르는 prop 기반 레이아웃으로 두고, 이 컴포넌트가 현재 라우트의 handle을
// 읽어 prop으로 넘기기만 한다. 그래서 옵션이 다른 화면이 생겨도 레이아웃 라우트를 따로 선언하지 않고,
// 화면을 오가도 레이아웃이 다시 마운트되지 않는다.
function ScreenLayoutRoute() {
  const navigationType = useNavigationType();
  const location = useLocation();
  const historyIndexRef = useRef<number | null>(null);

  // 스택 슬라이드 전환(index.css)의 방향. 뒤로가기면 반대로 빠진다.
  // POP은 브라우저 뒤로가기·앞으로가기를 구분하지 않아서, 히스토리 위치가 이전보다 작아졌을 때만 뒤로 본다.
  // 위치를 알 수 없는 POP은 앱에서 거의 뒤로가기뿐이라 뒤로 처리한다.
  // 전환 애니메이션은 새 화면이 커밋된 뒤 시작되므로, 페인트 전에 도는 layout effect에서 정해 두면
  // 이번 전환부터 바로 반영된다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 이동마다(location.key) 방향을 다시 정한다
  useLayoutEffect(() => {
    const historyIndex = getHistoryIndex();
    const previousHistoryIndex = historyIndexRef.current;
    historyIndexRef.current = historyIndex;

    const isForwardPop =
      historyIndex !== null &&
      previousHistoryIndex !== null &&
      historyIndex > previousHistoryIndex;
    document.documentElement.dataset.navigation =
      navigationType === "POP" && !isForwardPop ? "back" : "forward";
  }, [navigationType, location.key]);

  const handles = useMatches()
    .map((match) => match.handle)
    .filter(isScreenRouteHandle);

  return (
    <ScreenLayout
      background={
        resolveScreenRouteOption(handles, "background") ?? "alternative"
      }
      hasBottomNav={resolveScreenRouteOption(handles, "hasBottomNav") ?? true}
    />
  );
}

export default ScreenLayoutRoute;
