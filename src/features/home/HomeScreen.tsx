import { PushBadge, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch, IconSetting } from "@wanteddev/wds-icon";
import { Link, useNavigate } from "react-router-dom";
import chatbotIcon from "@/assets/icons/chat/bot.svg";
import logo from "@/assets/icons/home/logo.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { HOME_HAS_UNREAD_NOTIFICATION } from "@/features/home/constants/homeMock";

// 홈 화면 콘텐츠는 아직 없어서, 라우팅이 실제로 동작하는지 확인할 placeholder만 둔다.
// 챗봇 FAB(Figma nodeId 2443:178457 등, 홈 화면 variant마다 우하단에 고정)만 먼저 구현한다 —
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
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-label-alternative text-sm">
          홈 화면은 아직 준비 중이에요
        </p>
        <Link className="text-primary text-sm underline" to="/bililge">
          빌릴게 화면 보기
        </Link>
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
