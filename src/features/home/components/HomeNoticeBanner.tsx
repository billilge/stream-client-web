import { PageCounter, Typography } from "@wanteddev/wds";
import { useEffect, useRef } from "react";

import noticeEvent from "@/assets/images/home/notice-event.jpg";
import noticeFeedback from "@/assets/images/home/notice-feedback.jpg";
import noticeGeneral from "@/assets/images/home/notice-general.jpg";
import noticeLocker from "@/assets/images/home/notice-locker.jpg";
import noticePartnership from "@/assets/images/home/notice-partnership.jpg";
import noticeSnack from "@/assets/images/home/notice-snack.jpg";
import type {
  HomeNotice,
  HomeNoticeTemplate,
} from "@/features/home/constants/homeMock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AUTO_SLIDE_MS = 5000;

interface NoticeTemplateStyle {
  // 그림·그라데이션을 Figma 배치대로 카드 폭(335) 크기로 합친 그림
  art: string;
  // 그림 아래 글자 영역 배경. 그림 아래쪽 색과 같다
  backgroundClassName: string;
}

// Figma: Notice Carousel (nodeId 3562:163869) — 일반공지 3562:163870, 행사 3562:163888,
// 제휴 3562:163897, 사물함 3562:163906, 간식 3562:163915, 의견·설문 3562:163879
const NOTICE_TEMPLATES: Record<HomeNoticeTemplate, NoticeTemplateStyle> = {
  event: { art: noticeEvent, backgroundClassName: "bg-notice-banner-event" },
  feedback: {
    art: noticeFeedback,
    backgroundClassName: "bg-notice-banner-general",
  },
  general: {
    art: noticeGeneral,
    backgroundClassName: "bg-notice-banner-general",
  },
  locker: { art: noticeLocker, backgroundClassName: "bg-notice-banner-locker" },
  partnership: {
    art: noticePartnership,
    backgroundClassName: "bg-notice-banner-partnership",
  },
  snack: { art: noticeSnack, backgroundClassName: "bg-notice-banner-snack" },
};

// 공지가 하나도 없을 때 보여 주는 배너
const DEFAULT_NOTICE: HomeNotice = {
  id: "default",
  subtitle: "새 소식이 생기면 여기에서 알려 드릴게요",
  template: "general",
  title: "stream에 오신 것을 환영해요",
};

interface HomeNoticeCardProps {
  notice: HomeNotice;
  index: number;
  total: number;
  // 마지막 카드 뒤에 붙는 첫 카드 복제본 — 스크린리더가 두 번 읽지 않게 숨긴다
  isClone?: boolean;
}

function HomeNoticeCard({
  notice,
  index,
  total,
  isClone,
}: HomeNoticeCardProps) {
  const template = NOTICE_TEMPLATES[notice.template];

  return (
    <div
      aria-hidden={isClone}
      // border-[0.5px]: Figma 흰 테두리 0.5px — 단계로 나타낼 수 없는 선 굵기라 임의값으로 둔다
      className={`relative flex h-notice-banner w-full shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border-[0.5px] border-static-white px-4 py-5 shadow-spread-small ${template.backgroundClassName}`}
    >
      {/* 카드가 넓어져도 그림은 Figma 카드 폭(335 = w-83.75) 그대로 가운데에 둔다 */}
      <img
        alt=""
        className="absolute top-0 left-1/2 w-83.75 max-w-none -translate-x-1/2"
        src={template.art}
      />
      <div className="relative flex items-end justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography
            as="p"
            className="line-clamp-2 break-keep"
            color="semantic.label.normal"
            variant="heading2"
            weight="bold"
          >
            {notice.title}
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {notice.subtitle}
          </Typography>
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
    </div>
  );
}

// 한 칸 거리는 실제 카드 위치에서 잰다 — 간격 값(gap-10)을 한 곳에서만 관리한다
function getStep(scroller: HTMLElement) {
  const [first, second] = scroller.children as HTMLCollectionOf<HTMLElement>;
  return second.offsetLeft - first.offsetLeft;
}

// 5초마다 다음 카드로 넘어간다. 누르고 있는 동안은 멈추고, 손을 떼거나 스크롤이 멈추면 다시 5초를 센다.
// 배너가 하나면 넘기지 않는다.
// 마지막 카드 오른쪽에 첫 카드 복제본을 두어 끝에서도 같은 방향으로 이어지고, 복제본에 멈추면
// 진짜 첫 카드 위치로 순간 이동한다.
// 카드 폭은 화면 폭 - 40(Figma 375 기준 335)이고, 카드 사이(gap-10)도 좌우 여백 합 40이라 이전·다음 카드는 화면 밖에 있다.
// 가로 스크롤 영역이 카드 그림자(Shadow/Spread/Small, 60px)를 자르지 않게 위아래로 60px(15단계) 넓힌다.
// 넓힌 자리는 아래 섹션 밑으로 깔려서 아래 섹션 터치를 막지 않는다.
function HomeNoticeBanner({ notices }: { notices: HomeNotice[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const items = notices.length > 0 ? notices : [DEFAULT_NOTICE];
  const canSlide = items.length > 1;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !canSlide) {
      return;
    }

    // 복제본 자리면 진짜 첫 카드로 순간 이동한다. 공지 수가 줄어 복제본 자리에 걸린 경우도 여기서 풀린다.
    const jumpIfClone = () => {
      if (Math.round(scroller.scrollLeft / getStep(scroller)) >= items.length) {
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
  }, [canSlide, prefersReducedMotion, items.length]);

  return (
    <div
      className={`scrollbar-hidden -my-15 flex gap-10 px-5 py-15 ${canSlide ? "snap-x snap-mandatory scroll-px-5 overflow-x-auto" : "overflow-hidden"}`}
      ref={scrollerRef}
    >
      {items.map((notice, index) => (
        <HomeNoticeCard
          index={index}
          key={notice.id}
          notice={notice}
          total={items.length}
        />
      ))}
      {canSlide && (
        <HomeNoticeCard
          index={0}
          isClone
          notice={items[0]}
          total={items.length}
        />
      )}
    </div>
  );
}

export default HomeNoticeBanner;
