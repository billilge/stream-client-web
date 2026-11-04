import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconBell, IconPlus, IconSearch } from "@wanteddev/wds-icon";
import {
  Suspense,
  type UIEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksAllSection from "@/features/feedbacks/components/FeedbacksAllSection";
import FeedbacksAllSkeleton from "@/features/feedbacks/components/FeedbacksAllSkeleton";
import FeedbacksRecentCarousel from "@/features/feedbacks/components/FeedbacksRecentCarousel";
import FeedbacksRecentSkeleton from "@/features/feedbacks/components/FeedbacksRecentSkeleton";
import { NOTIFICATIONS_PATH } from "@/features/notifications/constants/notifications";
import { getSearchPath } from "@/features/search/constants/search";

interface FeedbacksListLocationState {
  feedbackSent?: boolean;
}

// FAB 축소 상태의 지름(Figma QA nodeId 2849:56930의 44px 원형 상태).
const FAB_COLLAPSED_WIDTH = 44;

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011), 피드백 전송 완료 토스트 (nodeId 1410:50080)
// 헤더·FAB·토스트는 데이터와 무관해서 바로 그리고, "최근 피드백"과 "전체 피드백"은 각자 데이터를 받는 동안
// 자기 자리만 스켈레톤으로 채운다.
function FeedbacksListScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // 피드백 작성 FAB — 맨 위에서는 아이콘+텍스트, 스크롤해서 내려가면 아이콘만 남는 원형으로
  // 축소된다(Figma QA nodeId 2849:56930). "맨 위 복귀 시" 다시 텍스트가 붙으라는 요구라
  // 스크롤 방향이 아니라 맨 위(scrollTop === 0) 여부만 본다.
  const [isFabExpanded, setIsFabExpanded] = useState(true);
  const fabRef = useRef<HTMLButtonElement>(null);
  // width를 애니메이션하려면 확장 상태의 실제 폭이 필요하다(padding만 바꾸면 텍스트가
  // 마운트/언마운트되며 폭이 툭 튀어서 축소 방향만 애니메이션이 안 도는 것처럼 보였다).
  // 텍스트를 상수로 재지 않고 DOM에서 실측한다 — 마운트 시 한 번만 잰다. isFabExpanded가
  // true로 바뀔 때마다 다시 재면, 축소→확장 전환 중(트랜지션이 아직 44px에서 안 벗어난
  // 시점)에 값을 읽어버려 폭이 44로 고정돼버리는 문제가 있었다.
  const [fabExpandedWidth, setFabExpandedWidth] = useState<number>();

  useLayoutEffect(() => {
    setFabExpandedWidth(fabRef.current?.getBoundingClientRect().width);
  }, []);

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

  const handleContentScroll = (event: UIEvent<HTMLDivElement>) => {
    setIsFabExpanded(event.currentTarget.scrollTop <= 0);
  };

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
      <div
        className="scrollbar-hidden flex-1 overflow-y-auto"
        onScroll={handleContentScroll}
      >
        <Suspense fallback={<FeedbacksRecentSkeleton />}>
          <FeedbacksRecentCarousel />
        </Suspense>

        <Suspense fallback={<FeedbacksAllSkeleton />}>
          <FeedbacksAllSection />
        </Suspense>
      </div>

      <button
        aria-label="피드백 작성"
        className={`absolute right-5 bottom-5 flex items-center gap-1 overflow-hidden rounded-full bg-primary shadow-[0px_6px_5px_rgba(23,23,23,0.08),0px_16px_12px_rgba(23,23,23,0.08)] transition-[width,padding] duration-500 ease-in-out motion-reduce:transition-none ${
          isFabExpanded ? "px-4 py-3" : "p-3"
        }`}
        onClick={() => navigate("/feedbacks/new")}
        ref={fabRef}
        style={{
          width: isFabExpanded ? fabExpandedWidth : FAB_COLLAPSED_WIDTH,
        }}
        type="button"
      >
        <IconPlus className="size-5 shrink-0 text-white" />
        {/* 텍스트를 마운트/언마운트하지 않고 항상 렌더링한 채 opacity로만 넘겼다 뺐다 한다
            — 그래야 버튼 폭(width) 전환과 같은 타이밍에 자연스럽게 같이 움직인다. */}
        <Typography
          className={`shrink-0 whitespace-nowrap transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
            isFabExpanded ? "opacity-100" : "opacity-0"
          }`}
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
