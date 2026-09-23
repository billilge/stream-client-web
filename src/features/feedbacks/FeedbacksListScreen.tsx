import {
  Divider,
  PaginationDots,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconPlus, IconSearch } from "@wanteddev/wds-icon";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FilterChipGroup from "@/components/ui/FilterChipGroup";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksCard from "@/features/feedbacks/components/FeedbacksCard";
import FeedbacksQaCard from "@/features/feedbacks/components/FeedbacksQaCard";
import {
  FEEDBACK_ROUND_FILTERS,
  FEEDBACKS,
} from "@/features/feedbacks/constants/feedbacks";

// 카드 한 장이 차지하는 가로 길이(카드 폭 + 캐러셀 gap). FeedbacksQaCard의 폭이 폰(286px)과
// 데스크톱 컬럼(sm 이상 391px)에서 다르기 때문에 상수로 박아두면 한쪽에서 점이 어긋난다
// — 실제 카드 폭과 gap을 DOM에서 재서 쓴다.
function getCarouselItemWidth(el: HTMLDivElement): number {
  const firstCard = el.firstElementChild;
  if (!firstCard) {
    return 0;
  }
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

interface FeedbacksListLocationState {
  feedbackSent?: boolean;
}

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011), 피드백 전송 완료 토스트 (nodeId 1410:50080)
function FeedbacksListScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roundFilter, setRoundFilter] = useState("all");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselPage, setCarouselPage] = useState(1);
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

  // 캐러셀은 가로 스크롤이라 PaginationDots.currentPage를 고정값으로 두면 스크롤해도 첫 점만
  // 활성으로 보인다(/pr-check 리뷰 지적) — 스크롤 위치로 현재 카드를 계산해 동기화한다.
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) {
      return;
    }
    const itemWidth = getCarouselItemWidth(el);
    if (!itemWidth) {
      return;
    }
    setCarouselPage(Math.round(el.scrollLeft / itemWidth) + 1);
  };

  const scrollCarouselToPage = (page: number) => {
    const el = carouselRef.current;
    if (!el) {
      return;
    }
    el.scrollTo({
      behavior: "smooth",
      left: (page - 1) * getCarouselItemWidth(el),
    });
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
          <TopNavigationButton aria-label="검색" variant="icon">
            <IconSearch />
          </TopNavigationButton>
          <TopNavigationButton aria-label="알림" variant="icon">
            <IconBell />
          </TopNavigationButton>
        </>
      }
    />,
  );

  const answeredFeedbacks = FEEDBACKS.filter((feedback) => feedback.answer);
  const feedbacks = FEEDBACKS.filter(
    (feedback) => roundFilter === "all" || feedback.round === roundFilter,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 px-5 pt-2">
          <Typography
            color="semantic.label.normal"
            variant="headline2"
            weight="bold"
          >
            최근 피드백
          </Typography>
          <div className="flex flex-col items-center gap-4">
            <div
              className="scrollbar-hidden flex w-full gap-2 overflow-x-auto"
              onScroll={handleCarouselScroll}
              ref={carouselRef}
            >
              {answeredFeedbacks.map((feedback) => (
                <FeedbacksQaCard
                  answer={feedback.answer ?? ""}
                  key={feedback.id}
                  question={feedback.question}
                />
              ))}
            </div>
            <PaginationDots
              currentPage={carouselPage}
              onClickDot={scrollCarouselToPage}
              size="small"
              totalPages={answeredFeedbacks.length}
            />
          </div>
        </div>

        <div className="my-8 h-2 w-full bg-background-alternative" />

        <div className="flex flex-col gap-4 pb-24">
          <div className="flex flex-col gap-3">
            <div className="px-5">
              <Typography
                color="semantic.label.normal"
                variant="headline2"
                weight="bold"
              >
                전체 피드백
              </Typography>
            </div>
            <div className="px-5">
              <FilterChipGroup
                onChange={setRoundFilter}
                options={FEEDBACK_ROUND_FILTERS}
                value={roundFilter}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {feedbacks.map((feedback, index) => (
              <Fragment key={feedback.id}>
                {index > 0 && (
                  <div className="px-5">
                    <Divider color="semantic.line.normal.alternative" />
                  </div>
                )}
                <FeedbacksCard
                  question={feedback.question}
                  round={feedback.round}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <button
        aria-label="피드백 작성"
        className="absolute right-5 bottom-5 flex items-center gap-1 rounded-full bg-primary px-4 py-3 shadow-[0px_6px_5px_rgba(23,23,23,0.08),0px_16px_12px_rgba(23,23,23,0.08)]"
        onClick={() => navigate("/feedbacks/new")}
        type="button"
      >
        <IconPlus className="size-5 text-white" />
        <Typography color="atomic.common.100" variant="label1" weight="bold">
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
