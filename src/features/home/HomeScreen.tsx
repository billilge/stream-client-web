import { PushBadge, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch, IconSetting } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatbotIcon from "@/assets/icons/chat/bot.svg";
import logo from "@/assets/icons/home/logo.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { BILILGE_TAB_PATHS } from "@/features/bililge/constants/bililge";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import HomeAppliedEventSection from "@/features/home/components/HomeAppliedEventSection";
import HomeApplyCard from "@/features/home/components/HomeApplyCard";
import HomeArchiveBanner from "@/features/home/components/HomeArchiveBanner";
import HomeInfoList from "@/features/home/components/HomeInfoList";
import HomeNoticeBanner from "@/features/home/components/HomeNoticeBanner";
import HomeRentalSection from "@/features/home/components/HomeRentalSection";
import {
  HOME_HAS_UNREAD_NOTIFICATION,
  HOME_MOCK_DATA,
} from "@/features/home/constants/homeMock";
import { getSearchPath } from "@/features/search/constants/search";

// Figma: 홈 2건 이하 (nodeId 3147:146240), 3건 이상 (3147:146297), empty (3147:146366)
// 챗봇 FAB(Figma nodeId 2443:178457 등, 홈 화면 variant마다 우하단에 고정) —
// 우측 20px·바텀 내비 위 24px 고정 위치는 Figma에서 홈 variant별로 다른 화면 높이에서도
// Bottom Nav 상단과의 간격이 항상 24px로 일정한 걸 좌표로 확인해서 얻은 값이다.
function HomeScreen() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // 상세·신청·내 내역처럼 화면을 쌓는 이동은 슬라이드로, 하단 탭 화면(빌릴게·행사와 그 탭)으로는 바로 바꾼다
  const push = (to: string) => navigate(to, { viewTransition: true });

  return (
    <div className="relative flex h-full flex-col">
      {/* 스크롤 영역 자체를 flex로 두면 내용이 길 때 섹션이 줄어들어서(배너 가로 스크롤 영역은 최소 높이가 0) 안쪽에서 쌓는다 */}
      <div
        className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto"
        onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}
      >
        {/* Figma: Top Navigation State=Home (nodeId 547:31364), 알림 있을 때 (3147:146473)
            홈만 헤더를 스크롤 영역 안에 둔다. Figma는 헤더 배경이 없어 배너 그림자가 헤더까지 번지는데,
            레이아웃 헤더 슬롯에 두면 그 경계에서 그림자가 잘려 선이 생긴다. 스크롤하면 배경을 깔아
            지나가는 내용과 겹치지 않게 한다. */}
        <div
          className={`sticky top-0 z-10 transition-colors ${isScrolled ? "bg-background-alternative" : ""}`}
        >
          <ScreenHeader
            title={
              <h2>
                <img alt="stream" className="h-8 w-28" src={logo} />
              </h2>
            }
            trailing={
              <>
                <TopNavigationButton aria-label="설정" variant="icon">
                  <IconSetting />
                </TopNavigationButton>
                <TopNavigationButton
                  aria-label="검색"
                  onClick={() => navigate(getSearchPath())}
                  variant="icon"
                >
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
          />
        </div>
        <div className="flex flex-col gap-3 pt-0.5 pb-4">
          <HomeNoticeBanner
            notices={HOME_MOCK_DATA.notices}
            onSelect={(noticeId) => push(`/notices/${noticeId}`)}
          />
          {/* 배너 카드(relative)가 뒤 섹션보다 나중에 그려져 그림자가 덮지 않게 뒤 섹션도 relative로 둔다 */}
          <div className="relative flex flex-col gap-3">
            {HOME_MOCK_DATA.applyCards.length > 0 && (
              <div className="flex flex-col gap-3 px-5">
                {HOME_MOCK_DATA.applyCards.map((card) => (
                  <HomeApplyCard
                    card={card}
                    key={card.id}
                    // 사물함은 상세 화면이 없어서 카드도 신청(유의사항 시트 → 구역 선택)으로 보낸다
                    onApply={() =>
                      push(
                        card.kind === "event"
                          ? `/events/${card.eventId}/apply`
                          : "/lockers/apply",
                      )
                    }
                    onSelect={() =>
                      push(
                        card.kind === "event"
                          ? `/events/${card.eventId}`
                          : "/lockers/apply",
                      )
                    }
                  />
                ))}
              </div>
            )}
            <div className="px-5">
              <HomeRentalSection
                onBrowse={() => navigate(BILILGE_TAB_PATHS.rent)}
                onMore={() => navigate(BILILGE_TAB_PATHS.return)}
                rentals={HOME_MOCK_DATA.rentals}
              />
            </div>
            <div className="px-5">
              <HomeAppliedEventSection
                events={HOME_MOCK_DATA.appliedEvents}
                onBrowse={() => navigate(EVENTS_TAB_PATHS.event)}
                onMore={() => navigate(EVENTS_TAB_PATHS.application)}
                onSelect={(event) =>
                  push(`${EVENTS_TAB_PATHS.application}/${event.applicationId}`)
                }
              />
            </div>
            <div className="px-5">
              <HomeInfoList
                myInfo={HOME_MOCK_DATA.myInfo}
                onSelectFee={() => push("/my/fee")}
                onSelectFeedbacks={() => push("/my/feedbacks")}
                onSelectLocker={() => push("/my/locker")}
              />
            </div>
            <div className="px-5">
              <HomeArchiveBanner />
            </div>
          </div>
        </div>
      </div>
      <button
        aria-label="챗봇 열기"
        className="absolute right-5 bottom-6 flex size-14 items-center justify-center rounded-full bg-primary drop-shadow-chatbot-fab"
        onClick={() => navigate("/chat")}
        type="button"
      >
        <img alt="" src={chatbotIcon} />
      </button>
    </div>
  );
}

export default HomeScreen;
