import { PushBadge, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch, IconSetting } from "@wanteddev/wds-icon";
import { useNavigate } from "react-router-dom";
import chatbotIcon from "@/assets/icons/chat/bot.svg";
import logo from "@/assets/icons/home/logo.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import HomeApplyCard from "@/features/home/components/HomeApplyCard";
import HomeNoticeBanner from "@/features/home/components/HomeNoticeBanner";
import {
  HOME_HAS_UNREAD_NOTIFICATION,
  HOME_MOCK_DATA,
} from "@/features/home/constants/homeMock";

// Figma: 홈 2건 이하 (nodeId 3147:146240), 3건 이상 (3147:146297), empty (3147:146366)
// 챗봇 FAB(Figma nodeId 2443:178457 등, 홈 화면 variant마다 우하단에 고정) —
// 우측 20px·바텀 내비 위 24px 고정 위치는 Figma에서 홈 variant별로 다른 화면 높이에서도
// Bottom Nav 상단과의 간격이 항상 24px로 일정한 걸 좌표로 확인해서 얻은 값이다.
function HomeScreen() {
  const navigate = useNavigate();

  // Figma: Top Navigation State=Home (nodeId 547:31364), 알림 있을 때 (3147:146473)
  useScreenHeader(
    <ScreenHeader
      title={<img alt="stream" className="h-8 w-28" src={logo} />}
      trailing={
        <>
          <TopNavigationButton aria-label="설정" variant="icon">
            <IconSetting />
          </TopNavigationButton>
          <TopNavigationButton aria-label="검색" variant="icon">
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <PushBadge
              invisible={!HOME_HAS_UNREAD_NOTIFICATION}
              position="top-right"
              variant="dot"
            >
              <IconBell />
            </PushBadge>
          </TopNavigationButton>
        </>
      }
    />,
  );

  return (
    <div className="relative flex h-full flex-col">
      <div className="scrollbar-hidden flex flex-1 flex-col gap-3 overflow-y-auto pt-0.5 pb-4">
        <HomeNoticeBanner notices={HOME_MOCK_DATA.notices} />
        {HOME_MOCK_DATA.applyCards.length > 0 && (
          <div className="flex flex-col gap-3 px-5">
            {HOME_MOCK_DATA.applyCards.map((card) => (
              <HomeApplyCard card={card} key={card.id} />
            ))}
          </div>
        )}
      </div>
      <button
        aria-label="챗봇 열기"
        className="absolute right-5 bottom-6 flex size-14 items-center justify-center rounded-full bg-primary drop-shadow-[2px_2px_10px_rgba(0,0,0,0.12)]"
        onClick={() => navigate("/chat")}
        type="button"
      >
        <img alt="" className="h-[33.5px] w-10" src={chatbotIcon} />
      </button>
    </div>
  );
}

export default HomeScreen;
