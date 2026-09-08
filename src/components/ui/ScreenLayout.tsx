import type { ReactNode } from "react";

import BottomNav, { type BottomNavValue } from "@/components/ui/BottomNav";

interface ScreenLayoutProps {
  header: ReactNode;
  children: ReactNode;
  bottomNavValue: BottomNavValue;
  onBottomNavValueChange: (value: BottomNavValue) => void;
}

// 홈/행사/게시판/빌릴게 등 모든 화면이 공유하는 뼈대 — 고정 크기(375x812) 프레임 안에서
// header·Bottom Nav는 고정, 본문만 스크롤된다. Top Navigation·필터·리스트 등 화면마다
// 다른 내용은 header/children으로 각 화면이 채운다(공통인 건 프레임 비율과 Bottom Nav뿐).
function ScreenLayout({
  header,
  children,
  bottomNavValue,
  onBottomNavValueChange,
}: ScreenLayoutProps) {
  return (
    <div className="flex h-[812px] w-[375px] flex-col overflow-hidden bg-background-alternative">
      <div className="shrink-0">{header}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="shrink-0">
        <BottomNav
          onValueChange={onBottomNavValueChange}
          value={bottomNavValue}
        />
      </div>
    </div>
  );
}

export default ScreenLayout;
