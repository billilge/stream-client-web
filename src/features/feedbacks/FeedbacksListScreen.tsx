import {
  Divider,
  PaginationDots,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconBell, IconPlus, IconSearch } from "@wanteddev/wds-icon";
import {
  Fragment,
  type UIEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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

// 카드 한 장이 차지하는 가로 길이(카드끼리 gap이 없어서 카드 폭 그 자체다). 카드가 캐러셀
// 폭에 꽉 차는 크기라 뷰포트마다 실제 폭이 다르기 때문에 상수로 박아두면 한쪽에서 점이
// 어긋난다 — 실제 카드 폭을 DOM에서 재서 쓴다.
function getCarouselItemWidth(el: HTMLDivElement): number {
  return el.firstElementChild?.getBoundingClientRect().width ?? 0;
}

interface FeedbacksListLocationState {
  feedbackSent?: boolean;
}

// FAB 축소 상태의 지름(Figma QA nodeId 2849:56930의 44px 원형 상태).
const FAB_COLLAPSED_WIDTH = 44;

// "최근 피드백" 캐러셀 카드 수 — 정적 목데이터라 모듈 스코프 상수로 뽑아두면 이펙트
// 안에서도(컴포넌트 상태가 아니라) exhaustive-deps 경고 없이 안전하게 참조할 수 있다.
const TOTAL_CAROUSEL_PAGES = FEEDBACKS.filter(
  (feedback) => feedback.answer,
).length;

// 스와이프/드래그로 인정할 최소 이동 비율(카드 폭 대비). 이보다 짧게 움직이면 그대로
// 원래 카드로 되돌아간다.
const CAROUSEL_DRAG_COMMIT_RATIO = 0.2;

// 짧고 빠르게 튕기는(flick) 스와이프를 인정할 속도 기준(px/ms). 이동 거리가
// CAROUSEL_DRAG_COMMIT_RATIO에 못 미쳐도, 손을 뗄 때 이 속도보다 빠르면 한 장 넘긴다 —
// 실제 네이티브 캐러셀들이 거리뿐 아니라 속도도 같이 보는 것과 같은 이유다.
const CAROUSEL_FLICK_VELOCITY_PX_MS = 0.35;

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011), 피드백 전송 완료 토스트 (nodeId 1410:50080)
function FeedbacksListScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roundFilter, setRoundFilter] = useState("all");
  const answeredFeedbacks = FEEDBACKS.filter((feedback) => feedback.answer);

  // "최근 피드백" 캐러셀. 기본은 평범한 가로 스크롤(snap)이라 마우스 휠·트랙패드는 브라우저
  // 기본 동작으로 그냥 잘 동작한다. 다만 두 가지를 추가로 가로챈다.
  // 1. 트랙패드 좌우 스와이프(wheel deltaX) — snap-mandatory만으로는 세게 스와이프하면
  //    카드를 여러 장 건너뛸 수 있어서, 한 번의 스와이프 제스처당 정확히 한 페이지만
  //    이동하도록 JS로 직접 처리한다.
  // 2. 실제 터치 스와이프(touchmove) — 마찬가지로 관성이 붙으면 여러 장을 건너뛴다
  //    (scroll-snap-stop:always만으로는 실기기에서 부족했다). 가로 방향이 확실할 때만
  //    네이티브 스크롤을 끄고 손가락 이동 거리만으로 정확히 한 페이지씩 옮긴다 — 세로
  //    스크롤(페이지 전체)로 판단되면 즉시 손을 떼고 브라우저 기본 동작에 맡긴다.
  // 마우스 클릭(Link 탭)은 이 두 경로 어디에도 안 걸쳐서 원래 하던 대로 그대로 동작한다.
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselPage, setCarouselPage] = useState(1);
  const carouselPageRef = useRef(carouselPage);

  useEffect(() => {
    carouselPageRef.current = carouselPage;
  }, [carouselPage]);

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

  // "최근 피드백" 카드 높이 — 질문·답변 글자 수가 카드마다 달라서 그대로 두면 카드마다
  // 높이가 들쭉날쭉했다. 첫 번째 카드 높이를 재서 나머지 카드에도 min-height로 맞춘다.
  const firstQaCardRef = useRef<HTMLAnchorElement>(null);
  const [qaCardMinHeight, setQaCardMinHeight] = useState<number>();

  useLayoutEffect(() => {
    setQaCardMinHeight(firstQaCardRef.current?.getBoundingClientRect().height);
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

  const handleContentScroll = (event: UIEvent<HTMLDivElement>) => {
    setIsFabExpanded(event.currentTarget.scrollTop <= 0);
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

  // 트랙패드 좌우 스와이프(wheel deltaX)일 때만 기본 스크롤을 막고 정확히 한 페이지씩
  // 이동시킨다. 세로 휠(페이지 스크롤)은 그대로 둔다. JSX onWheel은 리액트가 기본으로
  // passive 리스너를 붙여 preventDefault가 안 먹어서, 직접 addEventListener로 등록한다.
  //
  // 잠금 해제를 "힘의 크기가 다시 커지면"으로만 판단한다 — 관성은 물리적으로 시간이
  // 지날수록 deltaX 크기가 줄어들기만 하고 다시 커지는 일이 없다. 반대로 사용자가 진짜 새
  // 스와이프를 시작하면 그 순간 deltaX 크기가 직전 관성 꼬리값보다 반드시 커진다. 시간
  // 기반 보조 타이머는 일부러 안 둔다 — 있으면 "이 판단이 애매한 극소수 경우"를 잡아주긴
  // 하지만, 스와이프 직후 곧바로 다시 스와이프할 때 그 타이머 시간만큼 다음 스와이프가
  // 못 먹히는 순간이 생겨 오히려 부드럽지 않게 느껴졌다(실사용 확인됨).
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) {
      return;
    }
    let isLocked = false;
    let lastAbsDeltaX = 0;
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }
      event.preventDefault();
      const absDeltaX = Math.abs(event.deltaX);
      if (isLocked) {
        if (absDeltaX <= lastAbsDeltaX) {
          // 관성 꼬리 — 여전히 같은 스와이프의 연장이라 무시한다.
          lastAbsDeltaX = absDeltaX;
          return;
        }
        // 힘이 다시 커졌다 = 관성으로는 불가능한 일이니 새 스와이프가 시작된 것이다.
        isLocked = false;
      }
      lastAbsDeltaX = absDeltaX;
      const direction = event.deltaX > 0 ? 1 : -1;
      const nextPage = Math.min(
        Math.max(carouselPageRef.current + direction, 1),
        TOTAL_CAROUSEL_PAGES,
      );
      if (nextPage === carouselPageRef.current) {
        return;
      }
      isLocked = true;
      // carouselPageRef는 실제 스크롤 위치(onScroll)로 갱신되는데, smooth 애니메이션이 아직
      // 끝나기 전에 연속으로 스와이프하면 이 값이 못 따라와서 두 번째 스와이프가 같은
      // 페이지를 다시 목표로 잡아버린다(실사용 중 발견) — 스크롤이 실제로 끝나길 기다리지
      // 않고 여기서 바로 "의도한 다음 페이지"로 미리 갱신해 둔다.
      carouselPageRef.current = nextPage;
      const itemWidth = getCarouselItemWidth(el);
      el.scrollTo({ behavior: "smooth", left: (nextPage - 1) * itemWidth });
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // 실제 터치 스와이프 — 관성(모멘텀)이 스냅 지점 여러 개를 건너뛸 수 있어서(실기기 테스트로
  // 확인됨), 가로 방향이 확실해지면 네이티브 스크롤을 끄고 손가락을 그대로 따라가다가, 뗄
  // 때 이동 "거리"만 보고 한 페이지만 옮긴다(속도·관성과 무관하게 항상 한 장만 이동).
  // 세로로 움직이기 시작하면 즉시 손을 떼서 페이지 스크롤을 그대로 둔다.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) {
      return;
    }
    let drag: {
      startX: number;
      startY: number;
      startScrollLeft: number;
      // 드래그 중 el.scrollLeft를 직접 옮기면 네이티브 onScroll(handleCarouselScroll)이 그때
      // 그때 carouselPage를 다시 계산해버린다 — 카드 폭의 50%만 넘겨도 손을 떼기 전에 이미
      // "다음 페이지"로 갱신된다. 그 상태에서 손을 뗄 때 "현재 페이지 + 1"을 또 계산하면
      // 두 장이 건너뛰어진다(실기기 재현 확인됨). 그래서 제스처가 시작된 시점의 페이지를
      // 별도로 고정해 두고, 도착 페이지는 항상 이 값 기준으로만 계산한다.
      startPage: number;
      lastDeltaX: number;
      isHorizontal: boolean | null;
      // 짧고 빠른 flick도 인정하려고 "가장 최근 구간"의 순간 속도를 별도로 추적한다 —
      // 시작점부터 뗀 시점까지 평균을 내면, 천천히 끌다가 마지막에 휙 튕기는 자연스러운
      // 스와이프의 속도가 희석돼서 flick으로 안 잡힌다.
      lastMoveX: number;
      lastMoveTime: number;
      velocityX: number;
    } | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      const now = performance.now();
      drag = {
        isHorizontal: null,
        lastDeltaX: 0,
        lastMoveTime: now,
        lastMoveX: touch.clientX,
        startPage: carouselPageRef.current,
        startScrollLeft: el.scrollLeft,
        startX: touch.clientX,
        startY: touch.clientY,
        velocityX: 0,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!drag || event.touches.length !== 1) {
        return;
      }
      const touch = event.touches[0];
      const deltaX = touch.clientX - drag.startX;
      const deltaY = touch.clientY - drag.startY;
      if (drag.isHorizontal === null) {
        if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
          return;
        }
        drag.isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        if (!drag.isHorizontal) {
          // 세로 스크롤 의도 — 이 제스처는 더 이상 관여하지 않고 브라우저 기본 동작에 맡긴다.
          drag = null;
          return;
        }
      }
      drag.lastDeltaX = deltaX;
      const now = performance.now();
      const dt = now - drag.lastMoveTime;
      if (dt > 0) {
        drag.velocityX = (touch.clientX - drag.lastMoveX) / dt;
      }
      drag.lastMoveX = touch.clientX;
      drag.lastMoveTime = now;
      event.preventDefault();
      el.scrollLeft = drag.startScrollLeft - deltaX;
    };

    const handleTouchEnd = () => {
      if (!drag) {
        return;
      }
      const { lastDeltaX, velocityX, startPage } = drag;
      drag = null;
      const itemWidth = getCarouselItemWidth(el);
      if (!itemWidth) {
        return;
      }
      const isFarEnough =
        Math.abs(lastDeltaX) > itemWidth * CAROUSEL_DRAG_COMMIT_RATIO;
      const isFlick = Math.abs(velocityX) > CAROUSEL_FLICK_VELOCITY_PX_MS;
      // 드래그 도중 라이브 스크롤 위치로 갱신된 carouselPageRef가 아니라, 제스처 시작 시점에
      // 고정해 둔 startPage를 기준으로 계산한다 — 그래야 카드 폭 절반을 넘게 끌어도 정확히
      // 한 장만 이동한다.
      const nextPage =
        lastDeltaX !== 0 && (isFarEnough || isFlick)
          ? Math.min(
              Math.max(startPage + (lastDeltaX < 0 ? 1 : -1), 1),
              TOTAL_CAROUSEL_PAGES,
            )
          : startPage;
      // wheel 핸들러와 같은 이유로, 실제 스크롤(onScroll)이 따라오길 기다리지 않고 여기서
      // 바로 "의도한 다음 페이지"를 기록해 둔다 — 그래야 스크롤 애니메이션이 끝나기 전에
      // 바로 이어서 스와이프해도 같은 카드를 다시 목표로 잡지 않는다.
      carouselPageRef.current = nextPage;
      el.scrollTo({ behavior: "smooth", left: (nextPage - 1) * itemWidth });
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

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

  const feedbacks = FEEDBACKS.filter(
    (feedback) => roundFilter === "all" || feedback.round === roundFilter,
  );

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="scrollbar-hidden flex-1 overflow-y-auto"
        onScroll={handleContentScroll}
      >
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
              className="scrollbar-hidden flex w-full snap-x snap-mandatory overflow-x-auto"
              onScroll={handleCarouselScroll}
              ref={carouselRef}
            >
              {answeredFeedbacks.map((feedback, index) => (
                <Link
                  className="block w-full shrink-0 snap-start [scroll-snap-stop:always]"
                  key={feedback.id}
                  ref={index === 0 ? firstQaCardRef : undefined}
                  to={`/feedbacks/${feedback.id}`}
                >
                  <FeedbacksQaCard
                    answer={feedback.answer ?? ""}
                    height={qaCardMinHeight}
                    question={feedback.question}
                  />
                </Link>
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
                {feedback.answer ? (
                  <Link className="block" to={`/feedbacks/${feedback.id}`}>
                    <FeedbacksCard
                      question={feedback.question}
                      round={feedback.round}
                    />
                  </Link>
                ) : (
                  <FeedbacksCard
                    question={feedback.question}
                    round={feedback.round}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <button
        aria-label="피드백 작성"
        className={`absolute right-5 bottom-5 flex items-center gap-1 overflow-hidden rounded-full bg-primary shadow-[0px_6px_5px_rgba(23,23,23,0.08),0px_16px_12px_rgba(23,23,23,0.08)] transition-[width,padding] duration-500 ease-in-out ${
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
          className={`shrink-0 whitespace-nowrap transition-opacity duration-500 ease-in-out ${
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
