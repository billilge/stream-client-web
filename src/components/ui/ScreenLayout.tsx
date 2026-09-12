import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import BottomNav, { type BottomNavValue } from "@/components/ui/BottomNav";
import { ScreenHeaderContext } from "@/components/ui/screenHeaderContext";
import { ScreenSheetPortalContext } from "@/components/ui/screenSheetPortalContext";

// Bottom Nav 탭 ↔ 라우트 경로 매핑. 화면이 늘어나면 여기에 추가한다.
const BOTTOM_NAV_PATHS: Record<BottomNavValue, string> = {
  bililge: "/bililge",
  board: "/board",
  // 경로는 용어 사전(terminology.md)의 코드 용어 `events`를 따른다 — BottomNavValue 쪽 "event"는
  // 탭 식별자라 그대로 둔다.
  event: "/events",
  home: "/",
};

function getBottomNavValueFromPath(pathname: string): BottomNavValue {
  const matched = (
    Object.entries(BOTTOM_NAV_PATHS) as [BottomNavValue, string][]
  ).find(([, path]) => path === pathname);
  return matched?.[0] ?? "home";
}

// 홈/행사/게시판/빌릴게 등 Bottom Nav가 있는 화면 전용 라우트 레이아웃 — App.tsx에서 부모
// route로 두고 화면들을 자식 route(Outlet)로 넣는다. 화면이 직접 이 컴포넌트를 임포트해서
// 감쌀 필요가 없어서, "일부 화면만 감싸는 걸 깜빡"하는 불일치가 구조적으로 불가능해진다.
// 화면마다 다른 헤더(Top Navigation 등)는 useScreenHeader 훅으로 이 레이아웃에 등록한다.
// Bottom Nav의 활성 탭도 화면 state가 아니라 현재 라우트에서 파생시킨다.
function ScreenLayout() {
  const [header, setHeader] = useState<ReactNode>(null);
  const [sheetPortalEl, setSheetPortalEl] = useState<HTMLDivElement | null>(
    null,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const bottomNavValue = getBottomNavValueFromPath(location.pathname);

  return (
    <ScreenHeaderContext.Provider value={setHeader}>
      <ScreenSheetPortalContext.Provider value={sheetPortalEl}>
        <div className="relative flex h-[812px] w-[375px] flex-col overflow-hidden bg-background-alternative">
          <div className="shrink-0">{header}</div>
          {/* 스크롤 처리는 각 화면이 스스로 결정한다(예: 상단 토글/필터는 고정하고 목록만 스크롤) */}
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
          <div className="shrink-0">
            <BottomNav
              onValueChange={(value) => navigate(BOTTOM_NAV_PATHS[value])}
              value={bottomNavValue}
            />
          </div>
          {/* BottomSheet 포털 대상 — 헤더/본문/Bottom Nav보다 위(z-50)에 겹쳐서, 화면 하나가
              열어도 375×812 프레임 전체를 딤 처리할 수 있다. 시트가 닫혀있을 때는 빈 오버레이가
              클릭을 가로채지 않도록 pointer-events-none — BottomSheet가 열릴 때 자기 자신에만
              pointer-events-auto를 되돌려준다. */}
          <div
            className="pointer-events-none absolute inset-0 z-50"
            ref={setSheetPortalEl}
          />
        </div>
      </ScreenSheetPortalContext.Provider>
    </ScreenHeaderContext.Provider>
  );
}

export default ScreenLayout;
