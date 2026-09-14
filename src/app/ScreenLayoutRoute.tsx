import { useMatches } from "react-router-dom";

import ScreenLayout from "@/components/ui/ScreenLayout";

// 화면별 레이아웃 옵션 — router.tsx의 각 라우트에 `handle: { ... } satisfies ScreenRouteHandle`로 지정한다.
export interface ScreenRouteHandle {
  hasBottomNav?: boolean;
}

// useMatches()는 handle을 unknown으로 주기 때문에, hasBottomNav를 정한 handle만 골라낸다
function isScreenRouteHandle(handle: unknown): handle is ScreenRouteHandle {
  return (
    typeof handle === "object" && handle !== null && "hasBottomNav" in handle
  );
}

// ScreenLayout은 라우터를 모르는 prop 기반 레이아웃으로 두고, 이 컴포넌트가 현재 라우트의 handle을
// 읽어 prop으로 넘기기만 한다. 그래서 옵션이 다른 화면이 생겨도 레이아웃 라우트를 따로 선언하지 않고,
// 화면을 오가도 레이아웃이 다시 마운트되지 않는다.
function ScreenLayoutRoute() {
  const matches = useMatches();
  // matches는 바깥 라우트 → 안쪽 라우트 순서라, hasBottomNav를 정한 라우트 중 가장 안쪽 값을 쓴다
  const handles = matches
    .map((match) => match.handle)
    .filter(isScreenRouteHandle);
  const handle = handles[handles.length - 1];

  return <ScreenLayout hasBottomNav={handle?.hasBottomNav ?? true} />;
}

export default ScreenLayoutRoute;
