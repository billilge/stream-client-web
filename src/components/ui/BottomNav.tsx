import { Typography } from "@wanteddev/wds";
import {
  IconHome,
  IconList,
  IconStorage,
  IconTicket,
} from "@wanteddev/wds-icon";

import bililgeSelected from "@/assets/icons/bottom-nav/bililge-selected.svg";
import boardSelected from "@/assets/icons/bottom-nav/board-selected.svg";
import eventSelected from "@/assets/icons/bottom-nav/event-selected.svg";
import homeSelected from "@/assets/icons/bottom-nav/home-selected.svg";

export type BottomNavValue = "home" | "event" | "board" | "bililge";

interface BottomNavProps {
  value: BottomNavValue;
  onValueChange: (value: BottomNavValue) => void;
}

interface BottomNavTab {
  value: BottomNavValue;
  label: string;
  NormalIcon: typeof IconHome;
  selectedIcon: string;
}

// WDS에 선택 상태용 filled 아이콘이 없는 탭(게시판)이 있어, 4개 전부 Figma에서 내려받은 selected 아이콘으로 통일했다.
const TABS: BottomNavTab[] = [
  {
    NormalIcon: IconHome,
    label: "홈",
    selectedIcon: homeSelected,
    value: "home",
  },
  {
    NormalIcon: IconTicket,
    label: "행사",
    selectedIcon: eventSelected,
    value: "event",
  },
  {
    NormalIcon: IconList,
    label: "게시판",
    selectedIcon: boardSelected,
    value: "board",
  },
  {
    NormalIcon: IconStorage,
    label: "빌릴게",
    selectedIcon: bililgeSelected,
    value: "bililge",
  },
];

// Figma: Bottom Nav (nodeId 985:39948, Selected=Home/Event/Board/Rental) — WDS `BottomNavigation`은
// iOS 반투명 배경 + body 스크롤 기준 투명 전환 로직이 있어 우리 레이아웃(내부 스크롤)과 안 맞아서 쓰지 않고
// Stream 로컬 컴포넌트로 새로 만들었다.
// 상단 border 색은 Figma 스펙(Background/Elevated/Alternative, #f7f7f8)이 바로 위 스크롤 영역 배경과 완전히
// 같은 색이라 실제로는 안 보여서, 눈에 보이는 구분선이 되도록 Line/Solid/Neutral로 바꿨다.
function BottomNav({ value, onValueChange }: BottomNavProps) {
  return (
    <div className="flex w-full flex-col items-center rounded-t-3xl border-line-solid-neutral border-t bg-background-normal px-2 pt-2">
      <div className="flex w-full items-center justify-center">
        {TABS.map(({ value: tabValue, label, NormalIcon, selectedIcon }) => {
          const isSelected = tabValue === value;
          return (
            <button
              className="flex flex-1 flex-col items-center justify-center gap-1"
              key={tabValue}
              onClick={() => onValueChange(tabValue)}
              type="button"
            >
              {isSelected ? (
                <img alt="" className="size-6" src={selectedIcon} />
              ) : (
                <NormalIcon className="size-6 text-label-assistive" />
              )}
              <Typography
                color={
                  isSelected
                    ? "semantic.primary.normal"
                    : "semantic.label.assistive"
                }
                variant="caption2"
                weight="medium"
              >
                {label}
              </Typography>
            </button>
          );
        })}
      </div>
      {/* iOS 홈 인디케이터 자리(Figma 812 프레임이 포함하는 34px). 앱 WebView에서는 네이티브
          세이프에어리어가 이미 확보해 줘서 여기서 또 주면 여백이 두 번 들어간다.
          홈 인디케이터가 없는 데스크톱 컬럼에서만 Figma 스펙대로 남긴다. */}
      <div className="h-safe-bottom w-full sm:h-[34px]" />
    </div>
  );
}

export default BottomNav;
