import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconBell, IconPlus, IconSearch } from "@wanteddev/wds-icon";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksAllSection from "@/features/feedbacks/components/FeedbacksAllSection";
import FeedbacksAllSkeleton from "@/features/feedbacks/components/FeedbacksAllSkeleton";
import FeedbacksIntro from "@/features/feedbacks/components/FeedbacksIntro";
import FeedbacksRecentCarousel from "@/features/feedbacks/components/FeedbacksRecentCarousel";
import FeedbacksRecentSkeleton from "@/features/feedbacks/components/FeedbacksRecentSkeleton";
import { MY_FEEDBACKS_PATH } from "@/features/feedbacks/constants/feedbacks";
import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/notifications";
import { getSearchPath } from "@/features/search/constants/search";

interface FeedbacksListLocationState {
  feedbackSent?: boolean;
}

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011), 피드백 전송 완료 토스트 (nodeId 1410:50080),
// 열린피드백 개선 UI 1123 (nodeId 5421:95607 — 맨 위 소개 영역과 스크롤 시 플로팅 버튼)
// 헤더·FAB·토스트는 데이터와 무관해서 바로 그리고, "최근 피드백"과 "전체 피드백"은 각자 데이터를 받는 동안
// 자기 자리만 스켈레톤으로 채운다.
function FeedbacksListScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // 피드백 작성 플로팅 버튼 — 소개 영역의 '피드백 작성하기' 버튼이 보이는 동안은 숨기고, 스크롤해서 그 버튼이
  // 화면 밖으로 나가면 '+ 피드백 작성'으로 띄운다(Figma 5323:69763 "스크롤 시 플로팅", 디스크립션 4번).
  // 같은 동작을 하는 버튼이 두 개 겹쳐 보이지 않게 하려는 것이라, 스크롤 위치 대신 그 버튼이 실제로 보이는지를 본다.
  const scrollRef = useRef<HTMLDivElement>(null);
  const writeButtonRef = useRef<HTMLButtonElement>(null);
  const [isFabVisible, setIsFabVisible] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    const target = writeButtonRef.current;
    if (!root || !target) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsFabVisible(!entry.isIntersecting),
      { root },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const goToWrite = () => navigate("/feedbacks/new");

  // 피드백 작성 화면에서 넘어올 때만 history state로 신호를 받는다(navigate state) — 그 외
  // 진입(바텀 탭 등)에서는 안 뜬다. 새로고침 시 재노출을 막으려고 받자마자 state를 비운다.
  const [isSentToastOpen, setIsSentToastOpen] = useState(
    Boolean(
      (location.state as FeedbacksListLocationState | null)?.feedbackSent,
    ),
  );

  useEffect(() => {
    if ((location.state as FeedbacksListLocationState | null)?.feedbackSent) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // "공지"/"열린피드백" 토글은 게시판-공지 화면과 같은 ScreenHeaderToggleTitle을 쓴다. 이제
  // 두 화면이 다 있어서 클릭하면 실제로 이동하도록 onChange를 연결한다(공지 쪽도 함께 연결).
  useScreenHeader(
    <ScreenHeader
      title={{
        activeIndex: 1,
        onChange: (index) => navigate(index === 0 ? "/notices" : "/feedbacks"),
        options: ["공지", "열린피드백"],
      }}
      trailing={
        <>
          <TopNavigationButton
            aria-label="검색"
            onClick={() => navigate(getSearchPath("feedbacks"))}
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
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto" ref={scrollRef}>
        {/* 소개 영역 아래 여백 20px + 최근 피드백 위 8px(pt-2) = Figma 구분선 아래 28px */}
        <div className="mb-5">
          <FeedbacksIntro
            onViewHistory={() =>
              navigate(MY_FEEDBACKS_PATH, { viewTransition: true })
            }
            onWrite={goToWrite}
            writeButtonRef={writeButtonRef}
          />
        </div>

        <Suspense fallback={<FeedbacksRecentSkeleton />}>
          <FeedbacksRecentCarousel />
        </Suspense>

        <Suspense fallback={<FeedbacksAllSkeleton />}>
          <FeedbacksAllSection />
        </Suspense>
      </div>

      {/* 숨어 있을 때는 inert로 키보드·스크린리더에서도 빼서, 보이는 '피드백 작성하기' 버튼과 겹쳐 잡히지 않게 한다 */}
      <button
        className={`absolute right-5 bottom-5 flex items-center gap-1 rounded-full bg-primary px-4 py-3 shadow-[0px_6px_5px_rgba(23,23,23,0.08),0px_16px_12px_rgba(23,23,23,0.08)] transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none ${
          isFabVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        inert={!isFabVisible}
        onClick={goToWrite}
        type="button"
      >
        <IconPlus className="size-5 shrink-0 text-white" />
        <Typography
          className="whitespace-nowrap"
          color="atomic.common.100"
          variant="label1"
          weight="bold"
        >
          피드백 작성
        </Typography>
      </button>

      <ScreenToast
        message="피드백을 보냈어요."
        onOpenChange={setIsSentToastOpen}
        open={isSentToastOpen}
        variant="positive"
      />
    </div>
  );
}

export default FeedbacksListScreen;
