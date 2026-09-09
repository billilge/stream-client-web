import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BottomNav, { type BottomNavValue } from "@/components/ui/BottomNav";

interface ScreenLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

// Bottom Nav 탭 ↔ 라우트 경로 매핑. 화면이 늘어나면 여기에 추가한다.
const BOTTOM_NAV_PATHS: Record<BottomNavValue, string> = {
  board: "/board",
  event: "/event",
  home: "/",
  rental: "/rental",
};

function getBottomNavValueFromPath(pathname: string): BottomNavValue {
  const matched = (
    Object.entries(BOTTOM_NAV_PATHS) as [BottomNavValue, string][]
  ).find(([, path]) => path === pathname);
  return matched?.[0] ?? "home";
}

// 홈/행사/게시판/빌릴게 등 모든 화면이 공유하는 뼈대 — 고정 크기(375x812) 프레임 안에서
// header·Bottom Nav는 고정, 본문만 스크롤된다. Top Navigation·필터·리스트 등 화면마다
// 다른 내용은 header/children으로 각 화면이 채운다(공통인 건 프레임 비율과 Bottom Nav뿐).
// Bottom Nav의 활성 탭은 화면마다 state로 들고 있지 않고 현재 라우트에서 파생시킨다 —
// URL이 진실의 원천이라, 화면마다 중복되던 상태·네비게이션 핸들러가 필요 없어진다.
function ScreenLayout({ header, children }: ScreenLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const bottomNavValue = getBottomNavValueFromPath(location.pathname);

  return (
    <div className="flex h-[812px] w-[375px] flex-col overflow-hidden bg-background-alternative">
      <div className="shrink-0">{header}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="shrink-0">
        <BottomNav
          onValueChange={(value) => navigate(BOTTOM_NAV_PATHS[value])}
          value={bottomNavValue}
        />
      </div>
    </div>
  );
}

export default ScreenLayout;
