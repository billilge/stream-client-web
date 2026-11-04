import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginationDots, Typography } from "@wanteddev/wds";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import FeedbacksQaCard from "@/features/feedbacks/components/FeedbacksQaCard";
import { getFeedbackPath } from "@/features/feedbacks/constants/feedbacks";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";
import type { FeedbackResponse } from "@/shared/entities/feedbacks/feedbacksTypes";

// 카드 한 장이 차지하는 가로 길이(카드끼리 gap이 없어서 카드 폭 그 자체다). 카드가 캐러셀
// 폭에 꽉 차는 크기라 뷰포트마다 실제 폭이 다르기 때문에 상수로 박아두면 한쪽에서 점이
// 어긋난다 — 실제 카드 폭을 DOM에서 재서 쓴다.
function getCarouselItemWidth(el: HTMLDivElement): number {
  return el.firstElementChild?.getBoundingClientRect().width ?? 0;
}

// 스와이프/드래그로 인정할 최소 이동 비율(카드 폭 대비). 이보다 짧게 움직이면 그대로
// 원래 카드로 되돌아간다.
const CAROUSEL_DRAG_COMMIT_RATIO = 0.2;

// 짧고 빠르게 튕기는(flick) 스와이프를 인정할 속도 기준(px/ms). 이동 거리가
// CAROUSEL_DRAG_COMMIT_RATIO에 못 미쳐도, 손을 뗄 때 이 속도보다 빠르면 한 장 넘긴다 —
// 실제 네이티브 캐러셀들이 거리뿐 아니라 속도도 같이 보는 것과 같은 이유다.
const CAROUSEL_FLICK_VELOCITY_PX_MS = 0.35;

interface FeedbacksRecentCarouselViewProps {
  feedbacks: FeedbackResponse[];
}

// 캐러셀 본체 — 카드가 하나 이상일 때만 그려서 가로 스크롤 요소가 항상 있다(효과가 그 요소에 이벤트를 단다).
function FeedbacksRecentCarouselView({
  feedbacks,
}: FeedbacksRecentCarouselViewProps) {
  const totalPages = feedbacks.length;

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

  // "최근 피드백" 카드 높이 — 질문·답변 글자 수가 카드마다 달라서 그대로 두면 카드마다
  // 높이가 들쭉날쭉했다. 첫 번째 카드 높이를 재서 나머지 카드에도 min-height로 맞춘다.
  // 마운트 시 한 번만 재면, 이후 캐러셀 폭이 바뀌어(창 크기 조절, 모바일↔데스크톱 sm:
  // 브레이크포인트 전환) 텍스트 줄바꿈이 달라져도 값이 갱신되지 않는다(/pr-check 지적)
  // — 캐러셀 폭을 관찰해서 바뀔 때마다 다시 잰다. 카드 자신의 높이가 아니라 캐러셀 폭을
  // 관찰 대상으로 삼는 이유는, 카드 높이를 관찰하면 우리가 min-height를 다시 설정할 때마다
  // 그 변화가 또 리사이즈로 잡혀 무한 루프가 될 수 있어서다.
  const firstQaCardRef = useRef<HTMLAnchorElement>(null);
  const [qaCardMinHeight, setQaCardMinHeight] = useState<number>();

  useLayoutEffect(() => {
    const cardEl = firstQaCardRef.current;
    const viewportEl = carouselRef.current;
    if (!cardEl || !viewportEl) {
      return;
    }
    const measure = () => {
      // 이전에 재둔 min-height가 새로 잴 값을 오염시키지 않도록(카드가 이미 min-height로
      // 커진 상태면 그보다 작게는 절대 측정되지 않는다) 먼저 비우고, 리액트가 반영한 다음
      // 프레임에 자연스러운 콘텐츠 높이를 다시 잰다.
      setQaCardMinHeight(undefined);
      requestAnimationFrame(() => {
        setQaCardMinHeight(cardEl.getBoundingClientRect().height);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewportEl);
    return () => observer.disconnect();
  }, []);

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
  // "직전 샘플 단 하나"와만 비교하면 노이즈(측정 잡음)나, 한 번의 연속된 스와이프 안에서
  // 자연스럽게 살짝 가속하는 순간에도 "새 스와이프"로 오탐할 수 있다(/pr-check 지적).
  // 짧은 이동평균(WHEEL_NOISE_WINDOW개)과 비교하면 이런 일시적인 튐은 평균에 묻혀 걸러지고,
  // 평균보다 뚜렷하게 큰 힘만 새 스와이프로 잡힌다.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) {
      return;
    }
    const WHEEL_NOISE_WINDOW = 3;
    let isLocked = false;
    let recentAbsDeltas: number[] = [];
    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
        return;
      }
      event.preventDefault();
      const absDeltaX = Math.abs(event.deltaX);
      if (isLocked) {
        const recentAverage =
          recentAbsDeltas.reduce((sum, value) => sum + value, 0) /
          recentAbsDeltas.length;
        if (absDeltaX <= recentAverage) {
          // 관성 꼬리(또는 노이즈) — 여전히 같은 스와이프의 연장이라 무시한다.
          recentAbsDeltas.push(absDeltaX);
          if (recentAbsDeltas.length > WHEEL_NOISE_WINDOW) {
            recentAbsDeltas.shift();
          }
          return;
        }
        // 최근 평균보다 뚜렷하게 커졌다 = 새 스와이프가 시작된 것이다.
        isLocked = false;
      }
      recentAbsDeltas = [absDeltaX];
      const direction = event.deltaX > 0 ? 1 : -1;
      const nextPage = Math.min(
        Math.max(carouselPageRef.current + direction, 1),
        totalPages,
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
  }, [totalPages]);

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
              totalPages,
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
  }, [totalPages]);

  return (
    <>
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
            {feedbacks.map((feedback, index) => (
              <Link
                className="block w-full shrink-0 snap-start [scroll-snap-stop:always]"
                key={feedback.feedbackId}
                ref={index === 0 ? firstQaCardRef : undefined}
                to={getFeedbackPath(feedback.feedbackId)}
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
            totalPages={totalPages}
          />
        </div>
      </div>

      <div className="my-8 h-2 w-full bg-background-alternative" />
    </>
  );
}

// Figma: 게시판 - 열린피드백 (nodeId 1410:50011) "최근 피드백" 캐러셀.
// 필터 없는 공개 목록의 앞쪽 몇 건을 받아 그린다. 아직 공개된 답변이 없으면 제목과 구분선까지 통째로 그리지 않는다.
// 데이터를 받는 동안은 FeedbacksListScreen의 Suspense가 FeedbacksRecentSkeleton을 보여준다.
function FeedbacksRecentCarousel() {
  const { data: feedbacks } = useSuspenseQuery({
    ...feedbacksQueries.recent(),
    select: (data) => data.content,
  });

  if (feedbacks.length === 0) {
    return null;
  }
  return <FeedbacksRecentCarouselView feedbacks={feedbacks} />;
}

export default FeedbacksRecentCarousel;
