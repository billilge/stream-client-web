import type { ReactNode } from "react";

import BottomNav, { type BottomNavValue } from "@/components/ui/BottomNav";

interface ScreenLayoutBaseProps {
  header: ReactNode;
  children: ReactNode;
}

interface ScreenLayoutWithBottomNavProps extends ScreenLayoutBaseProps {
  hasBottomNav?: true;
  bottomNavValue: BottomNavValue;
  onBottomNavValueChange: (value: BottomNavValue) => void;
}

interface ScreenLayoutWithoutBottomNavProps extends ScreenLayoutBaseProps {
  hasBottomNav: false;
}

type ScreenLayoutProps =
  | ScreenLayoutWithBottomNavProps
  | ScreenLayoutWithoutBottomNavProps;

// 홈/행사/게시판/빌릴게 등 모든 화면이 공유하는 뼈대 — 고정 크기(375x812) 프레임 안에서
// header·Bottom Nav는 고정, 본문만 스크롤된다. Top Navigation·필터·리스트 등 화면마다
// 다른 내용은 header/children으로 각 화면이 채운다(공통인 건 프레임 비율과 Bottom Nav뿐).
// 아카이빙처럼 Bottom Nav가 없는 화면은 hasBottomNav={false}로 쓴다 — 이때 홈 인디케이터는
// Figma의 Home Bar처럼 본문 위에 겹쳐 떠 있으므로, 본문 하단 여백은 화면이 직접 챙긴다.
function ScreenLayout(props: ScreenLayoutProps) {
  const { header, children } = props;

  return (
    <div className="relative flex h-[812px] w-[375px] flex-col overflow-hidden bg-background-alternative">
      <div className="shrink-0">{header}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      {props.hasBottomNav === false ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34px]">
          <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-icons-primary" />
        </div>
      ) : (
        <div className="shrink-0">
          <BottomNav
            onValueChange={props.onBottomNavValueChange}
            value={props.bottomNavValue}
          />
        </div>
      )}
    </div>
  );
}

export default ScreenLayout;
