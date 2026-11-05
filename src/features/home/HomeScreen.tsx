import { PushBadge, TopNavigationButton } from "@wanteddev/wds";
import { IconBell, IconSearch, IconSetting } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatbotIcon from "@/assets/icons/chat/bot.svg";
import logo from "@/assets/icons/home/logo.svg";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { ARCHIVES_PATH } from "@/features/archives/constants/archives";
import { BILLILGE_TAB_PATHS } from "@/features/billilge/constants/billilge";
import { useBillilgeReturnRequest } from "@/features/billilge/hooks/useBillilgeReturnRequest";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import {
  FEE_PAYMENTS_PATH,
  FEE_TRANSFER_PATH,
} from "@/features/fee/constants/fee";
import { MY_FEEDBACKS_PATH } from "@/features/feedbacks/constants/feedbacks";
import HomeAppliedEventSection from "@/features/home/components/HomeAppliedEventSection";
import HomeAppliedEventSkeleton from "@/features/home/components/HomeAppliedEventSkeleton";
import HomeApplyCardList from "@/features/home/components/HomeApplyCardList";
import HomeArchiveBanner from "@/features/home/components/HomeArchiveBanner";
import HomeInfoList from "@/features/home/components/HomeInfoList";
import HomeInfoListSkeleton from "@/features/home/components/HomeInfoListSkeleton";
import HomeNoticeBanner from "@/features/home/components/HomeNoticeBanner";
import HomeNoticeBannerSkeleton from "@/features/home/components/HomeNoticeBannerSkeleton";
import HomeRentalSection from "@/features/home/components/HomeRentalSection";
import HomeRentalSkeleton from "@/features/home/components/HomeRentalSkeleton";
import { HOME_HAS_UNREAD_NOTIFICATION } from "@/features/home/constants/homeMock";
import { LOCKER_ASSIGNMENT_PATH } from "@/features/lockers/constants/lockers";
import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/notifications";
import { getSearchPath } from "@/features/search/constants/search";
import { SETTINGS_PATHS } from "@/features/settings/constants/settings";
import { openExternalLink } from "@/lib/openExternalLink";
import type {
  HomeApplySection,
  HomeBanner,
} from "@/shared/entities/home/homeTypes";

// Figma: 홈 2건 이하 (nodeId 3147:146240), 3건 이상 (3147:146297), empty (3147:146366)
// 챗봇 FAB(Figma nodeId 2443:178457 등, 홈 화면 variant마다 우하단에 고정) —
// 우측 20px·바텀 내비 위 24px 고정 위치는 Figma에서 홈 variant별로 다른 화면 높이에서도
// Bottom Nav 상단과의 간격이 항상 24px로 일정한 걸 좌표로 확인해서 얻은 값이다.
// 홈 데이터(GET /v1/app/home)는 한 번에 오지만, 섹션마다 Suspense를 따로 둬서 자기 자리에 스켈레톤을 그린다 —
// 같은 조회라 요청은 한 번이고, 다른 조회를 쓰는 대여 현황이 늦어도 나머지 섹션을 막지 않는다.
function HomeScreen() {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  // 상세·신청·내 내역처럼 화면을 쌓는 이동은 슬라이드로, 하단 탭 화면(빌릴게·행사와 그 탭)으로는 바로 바꾼다
  const push = (to: string) => navigate(to, { viewTransition: true });
  // 대여 현황의 반납 신청은 빌릴게로 보내지 않고 홈에서 바로 확인 모달을 띄운다
  const { openReturnRequest, returnRequestDialogs } =
    useBillilgeReturnRequest();

  // 배너는 운영진이 정한 곳으로 간다 — 공지·행사 상세는 앱 안 화면이고, 외부 링크는 앱 밖이다
  const openBanner = (banner: HomeBanner) => {
    if (banner.landingType === "EXTERNAL_LINK") {
      openExternalLink(banner.linkUrl);
      return;
    }
    push(
      banner.landingType === "NOTICE"
        ? `/notices/${banner.targetId}`
        : `/events/${banner.targetId}`,
    );
  };
  // 사물함은 상세 화면이 없어서 카드도 신청(유의사항 시트 → 구역 선택)으로 보낸다
  const getApplySectionPath = (section: HomeApplySection) =>
    section.targetType === "EVENT"
      ? `/events/${section.targetId}`
      : "/lockers/apply";

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
                <TopNavigationButton
                  aria-label="설정"
                  onClick={() =>
                    navigate(SETTINGS_PATHS.root, { viewTransition: true })
                  }
                  variant="icon"
                >
                  <IconSetting />
                </TopNavigationButton>
                <TopNavigationButton
                  aria-label="검색"
                  onClick={() => navigate(getSearchPath())}
                  variant="icon"
                >
                  <IconSearch />
                </TopNavigationButton>
                <TopNavigationButton
                  aria-label="알림"
                  onClick={() =>
                    navigate(NOTIFICATIONS_PATH, { viewTransition: true })
                  }
                  variant="icon"
                >
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
        <div className="flex flex-col gap-2 pt-0.5 pb-4">
          <Suspense fallback={<HomeNoticeBannerSkeleton />}>
            <HomeNoticeBanner onSelect={openBanner} />
          </Suspense>
          {/* 배너 카드(relative)가 뒤 섹션보다 나중에 그려져 그림자가 덮지 않게 뒤 섹션도 relative로 둔다 */}
          <div className="relative flex flex-col gap-2">
            <Suspense fallback={null}>
              <HomeApplyCardList
                onApply={(section) =>
                  push(
                    section.targetType === "EVENT"
                      ? `/events/${section.targetId}/apply`
                      : "/lockers/apply",
                  )
                }
                onSelect={(section) => push(getApplySectionPath(section))}
              />
            </Suspense>
            <div className="px-5">
              {/* 대여 현황은 반납 대기·확인을 나눠 보여 주려고 홈 조회가 아니라 빌릴게 반납 조회로 받는다 */}
              <Suspense fallback={<HomeRentalSkeleton />}>
                <HomeRentalSection
                  onBrowse={() => navigate(BILLILGE_TAB_PATHS.rent)}
                  onMore={() => navigate(BILLILGE_TAB_PATHS.return)}
                  onReturnRequest={openReturnRequest}
                />
              </Suspense>
            </div>
            <div className="px-5">
              <Suspense fallback={<HomeAppliedEventSkeleton />}>
                <HomeAppliedEventSection
                  onBrowse={() => navigate(EVENTS_TAB_PATHS.event)}
                  onMore={() => navigate(EVENTS_TAB_PATHS.application)}
                  onSelect={(event) =>
                    push(
                      `${EVENTS_TAB_PATHS.application}/${event.applicationId}`,
                    )
                  }
                />
              </Suspense>
            </div>
            <div className="px-5">
              <Suspense fallback={<HomeInfoListSkeleton />}>
                <HomeInfoList
                  onSelectFee={() => push(FEE_PAYMENTS_PATH)}
                  onSelectFeeTransfer={() => push(FEE_TRANSFER_PATH)}
                  onSelectFeedbacks={() => push(MY_FEEDBACKS_PATH)}
                  onSelectLocker={() => push(LOCKER_ASSIGNMENT_PATH)}
                />
              </Suspense>
            </div>
            <div className="px-5">
              <HomeArchiveBanner onSelect={() => push(ARCHIVES_PATH)} />
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
      {returnRequestDialogs}
    </div>
  );
}

export default HomeScreen;
