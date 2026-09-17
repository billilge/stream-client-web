import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import BottomNav, { type BottomNavValue } from "@/components/ui/BottomNav";
import { ScreenHeaderContext } from "@/components/ui/screenHeaderContext";
import { ScreenSheetPortalContext } from "@/components/ui/screenSheetPortalContext";

// Bottom Nav 탭 ↔ 라우트 경로 매핑. 화면이 늘어나면 여기에 추가한다.
const BOTTOM_NAV_PATHS: Record<BottomNavValue, string> = {
  bililge: "/bililge",
  // 게시판(공지) 목록 라우트 경로. 용어 사전(terminology.md)의 코드 용어가 `notices`라 그대로 맞춘다.
  board: "/notices",
  // 행사 목록 라우트 경로. 용어 사전(terminology.md)의 코드 용어가 `events`이고
  // 신청 폼 라우트도 `/events/:eventId/apply`라 여기도 복수형으로 맞춘다.
  event: "/events",
  home: "/",
};

function getBottomNavValueFromPath(pathname: string): BottomNavValue {
  const matched = (
    Object.entries(BOTTOM_NAV_PATHS) as [BottomNavValue, string][]
  ).find(([, path]) => path === pathname);
  return matched?.[0] ?? "home";
}

interface ScreenLayoutProps {
  hasBottomNav?: boolean;
  background?: "normal" | "alternative";
}

// 모든 화면이 공유하는 375×812 라우트 레이아웃 — router.tsx에서 부모 route로 두고 화면들을
// 자식 route(Outlet)로 넣는다. 화면이 직접 이 컴포넌트를 임포트해서 감쌀 필요가 없어서,
// "일부 화면만 감싸는 걸 깜빡"하는 불일치가 구조적으로 불가능해진다.
// 화면마다 다른 헤더(Top Navigation 등)는 useScreenHeader 훅으로 이 레이아웃에 등록한다.
// Bottom Nav의 활성 탭도 화면 state가 아니라 현재 라우트에서 파생시킨다.
// 신청 폼처럼 Bottom Nav 대신 하단 고정 버튼(Action Area)이 있는 화면은 라우트 handle에
// hasBottomNav: false를 지정하면 ScreenLayoutRoute가 이 prop으로 넘겨준다 — 이 컴포넌트는 라우터를 모른다.
// 본문 스크롤을 화면이 정하므로 Action Area는 화면이 자기 영역 하단에 직접 둔다.
function ScreenLayout({
  hasBottomNav = true,
  background = "alternative",
}: ScreenLayoutProps) {
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
        <div
          className={`relative flex h-[812px] w-[375px] flex-col overflow-hidden ${
            background === "normal"
              ? "bg-background-normal"
              : "bg-background-alternative"
          }`}
        >
          <div className="shrink-0">{header}</div>
          {/* 스크롤 처리는 각 화면이 스스로 결정한다(예: 상단 토글/필터는 고정하고 목록만 스크롤).
              overflow-y-auto가 동작하려면 자식 높이가 명확해야 해서, 화면마다 h-full을 직접
              챙기지 않아도 되도록 여기서 기본으로 보장한다. */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <Outlet />
            </div>
          </div>
          {hasBottomNav && (
            <div className="shrink-0">
              <BottomNav
                onValueChange={(value) => navigate(BOTTOM_NAV_PATHS[value])}
                value={bottomNavValue}
              />
            </div>
          )}
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
