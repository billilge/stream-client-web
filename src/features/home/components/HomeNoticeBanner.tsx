import { useSuspenseQuery } from "@tanstack/react-query";
import { PageCounter, Typography } from "@wanteddev/wds";
import { useEffect, useRef } from "react";

import noticeGeneral from "@/assets/images/home/notice-general.jpg";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { homeQueries } from "@/shared/entities/home/homeQueries";
import type {
  HomeBanner,
  HomeResponse,
} from "@/shared/entities/home/homeTypes";

const AUTO_SLIDE_MS = 5000;

// 배너가 하나도 없을 때 보여 주는 카드 — 누를 곳이 없다
const DEFAULT_BANNER = {
  subtitle: "새 소식이 생기면 여기에서 알려 드릴게요",
  title: "stream에 오신 것을 환영해요",
};

interface HomeNoticeCardProps {
  title: string;
  subtitle: string | null;
  // 카드 전체를 덮는 배경(서버 배너). 없으면 일반공지 그림을 깐다
  imageUrl?: string | null;
  index: number;
  total: number;
  // 마지막 카드 뒤에 붙는 첫 카드 복제본 — 스크린리더가 두 번 읽지 않게 숨긴다
  isClone?: boolean;
  // 없으면 누를 수 없는 카드(배너가 없을 때의 기본 카드)
  onSelect?: () => void;
}

// Figma: Notice Carousel (nodeId 3562:163869) — 일반공지 3562:163870, 행사 3562:163888,
// 제휴 3562:163897, 사물함 3562:163906, 간식 3562:163915
// 배경은 서버가 이미지 한 장(카드 전체 크기, 그림과 배경색을 합친 것)으로 준다 — 운영진이 고른 카테고리의
// 정해진 이미지거나 직접 올린 이미지다. 기본 카드와 이미지가 지워진 배너만 일반공지 그림과 배경색을 직접 깐다.
function HomeNoticeCard({
  title,
  subtitle,
  imageUrl,
  index,
  total,
  isClone,
  onSelect,
}: HomeNoticeCardProps) {
  // 공지·행사·외부 링크로 가는 카드는 버튼으로 그린다
  const Root = onSelect ? "button" : "div";

  return (
    <Root
      aria-hidden={isClone}
      // border-[0.5px]: Figma 흰 테두리 0.5px — 단계로 나타낼 수 없는 선 굵기라 임의값으로 둔다
      className="relative flex h-notice-banner w-full shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border-[0.5px] border-static-white bg-notice-banner-general px-4 py-5 text-left shadow-spread-small"
      onClick={onSelect}
      // 숨긴 복제본은 키보드 포커스도 받지 않는다
      tabIndex={isClone ? -1 : undefined}
      type={onSelect ? "button" : undefined}
    >
      {imageUrl ? (
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={imageUrl}
        />
      ) : (
        // 카드가 넓어져도 그림은 Figma 카드 폭(335 = w-83.75) 그대로 가운데에 둔다
        <img
          alt=""
          className="absolute top-0 left-1/2 w-83.75 max-w-none -translate-x-1/2"
          src={noticeGeneral}
        />
      )}
      <div className="relative flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* 운영진이 제목에 넣은 줄바꿈을 살린다 */}
          <Typography
            as="p"
            className="line-clamp-2 whitespace-pre-line break-keep"
            color="semantic.label.normal"
            variant="heading2"
            weight="bold"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {subtitle}
            </Typography>
          )}
        </div>
        {total > 1 && (
          <PageCounter
            alternative
            currentPage={index + 1}
            size="small"
            totalPages={total}
          />
        )}
      </div>
    </Root>
  );
}

// 한 칸 거리는 실제 카드 위치에서 잰다 — 간격 값(gap-10)을 한 곳에서만 관리한다
function getStep(scroller: HTMLElement) {
  const [first, second] = scroller.children as HTMLCollectionOf<HTMLElement>;
  return second.offsetLeft - first.offsetLeft;
}

function selectBanners(home: HomeResponse) {
  return home.banners;
}

// 5초마다 다음 카드로 넘어간다. 누르고 있는 동안은 멈추고, 손을 떼거나 스크롤이 멈추면 다시 5초를 센다.
// 배너가 하나면 넘기지 않는다.
// 마지막 카드 오른쪽에 첫 카드 복제본을 두어 끝에서도 같은 방향으로 이어지고, 복제본에 멈추면
// 진짜 첫 카드 위치로 순간 이동한다.
// 카드 폭은 화면 폭 - 40(Figma 375 기준 335)이고, 카드 사이(gap-10)도 좌우 여백 합 40이라 이전·다음 카드는 화면 밖에 있다.
// 가로 스크롤 영역이 카드 그림자(Shadow/Spread/Small, 60px)를 자르지 않게 위아래로 60px(15단계) 넓힌다.
// 넓힌 자리는 아래 섹션 밑으로 깔려서 아래 섹션 터치를 막지 않는다.
// 홈 데이터를 받는 동안은 HomeScreen의 Suspense가 HomeNoticeBannerSkeleton을 보여준다.
interface HomeNoticeBannerProps {
  onSelect: (banner: HomeBanner) => void;
}

function HomeNoticeBanner({ onSelect }: HomeNoticeBannerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { data: banners } = useSuspenseQuery({
    ...homeQueries.home(),
    select: selectBanners,
  });
  const canSlide = banners.length > 1;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !canSlide) {
      return;
    }

    // 복제본 자리면 진짜 첫 카드로 순간 이동한다. 공지 수가 줄어 복제본 자리에 걸린 경우도 여기서 풀린다.
    const jumpIfClone = () => {
      if (
        Math.round(scroller.scrollLeft / getStep(scroller)) >= banners.length
      ) {
        scroller.scrollTo({ behavior: "instant", left: 0 });
      }
    };

    let slideTimer = 0;
    let isPressing = false;
    const stopSlide = () => window.clearInterval(slideTimer);
    const startSlide = () => {
      stopSlide();
      if (prefersReducedMotion || isPressing) {
        return;
      }
      slideTimer = window.setInterval(() => {
        jumpIfClone();
        const step = getStep(scroller);
        const next = Math.round(scroller.scrollLeft / step) + 1;
        scroller.scrollTo({ behavior: "smooth", left: next * step });
      }, AUTO_SLIDE_MS);
    };

    // 스크롤이 멈추면(scrollend 미지원 WebView를 위해 scroll 디바운스) 복제본을 정리하고 5초를 다시 센다.
    // 트랙패드·휠처럼 누르지 않고 넘긴 경우도 여기서 다시 센다.
    let settleTimer = 0;
    const handleScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        jumpIfClone();
        startSlide();
      }, 150);
    };
    // 터치는 touch 이벤트로만 판단한다. 손가락을 옆으로 끌면 브라우저가 pointercancel을 먼저 보내서,
    // pointer 이벤트로 풀면 손가락이 아직 화면에 있는데 다시 넘어가기 시작한다.
    const handlePress = () => {
      isPressing = true;
      stopSlide();
    };
    const handleRelease = () => {
      if (!isPressing) {
        return;
      }
      isPressing = false;
      startSlide();
    };
    const handlePointerPress = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        handlePress();
      }
    };
    const handlePointerRelease = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        handleRelease();
      }
    };

    jumpIfClone();
    startSlide();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    scroller.addEventListener("pointerdown", handlePointerPress);
    scroller.addEventListener("touchstart", handlePress, { passive: true });
    // 영역 밖에서 손을 떼도 받도록 window에서 듣는다
    window.addEventListener("pointerup", handlePointerRelease);
    window.addEventListener("pointercancel", handlePointerRelease);
    window.addEventListener("touchend", handleRelease);
    window.addEventListener("touchcancel", handleRelease);

    return () => {
      window.clearTimeout(settleTimer);
      stopSlide();
      scroller.removeEventListener("scroll", handleScroll);
      scroller.removeEventListener("pointerdown", handlePointerPress);
      scroller.removeEventListener("touchstart", handlePress);
      window.removeEventListener("pointerup", handlePointerRelease);
      window.removeEventListener("pointercancel", handlePointerRelease);
      window.removeEventListener("touchend", handleRelease);
      window.removeEventListener("touchcancel", handleRelease);
    };
  }, [canSlide, prefersReducedMotion, banners.length]);

  return (
    <div
      className={`scrollbar-hidden -my-15 flex gap-10 px-5 py-15 ${canSlide ? "snap-x snap-mandatory scroll-px-5 overflow-x-auto" : "overflow-hidden"}`}
      ref={scrollerRef}
    >
      {banners.length === 0 ? (
        <HomeNoticeCard
          index={0}
          subtitle={DEFAULT_BANNER.subtitle}
          title={DEFAULT_BANNER.title}
          total={1}
        />
      ) : (
        banners.map((banner, index) => (
          <HomeNoticeCard
            imageUrl={banner.imageUrl}
            index={index}
            key={banner.bannerId}
            onSelect={() => onSelect(banner)}
            subtitle={banner.subtitle}
            title={banner.title}
            total={banners.length}
          />
        ))
      )}
      {canSlide && (
        <HomeNoticeCard
          imageUrl={banners[0].imageUrl}
          index={0}
          isClone
          onSelect={() => onSelect(banners[0])}
          subtitle={banners[0].subtitle}
          title={banners[0].title}
          total={banners.length}
        />
      )}
    </div>
  );
}

export default HomeNoticeBanner;
