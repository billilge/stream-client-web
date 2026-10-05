import { PageCounter, Typography } from "@wanteddev/wds";
import { useEffect, useRef } from "react";

import noticeEvent from "@/assets/images/home/notice-event.png";
import noticeFeedback from "@/assets/images/home/notice-feedback.png";
import noticeGeneral from "@/assets/images/home/notice-general.png";
import noticeLocker from "@/assets/images/home/notice-locker.png";
import noticePartnership from "@/assets/images/home/notice-partnership.png";
import noticeSnack from "@/assets/images/home/notice-snack.png";
import type {
  HomeNotice,
  HomeNoticeTemplate,
} from "@/features/home/constants/homeMock";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AUTO_SLIDE_MS = 5000;
const CARD_GAP = 8;

interface NoticeTemplateStyle {
  image: string;
  // 그림 자리. Figma 템플릿마다 그림 크기·위치가 다르다
  imageClassName: string;
  backgroundClassName: string;
  // 그림 아래를 배경색으로 덮어 글자와 이어 주는 그라데이션
  fadeClassName: string;
}

// Figma: Notice Carousel (nodeId 3562:163869) — 일반공지 3562:163870, 행사 3562:163888,
// 제휴 3562:163897, 사물함 3562:163906, 간식 3562:163915, 의견·설문 3562:163879
const NOTICE_TEMPLATES: Record<HomeNoticeTemplate, NoticeTemplateStyle> = {
  event: {
    backgroundClassName: "bg-notice-banner-event",
    fadeClassName: "top-[86px] h-[98px] from-notice-banner-event",
    image: noticeEvent,
    imageClassName: "top-6 h-40 w-[272px]",
  },
  feedback: {
    backgroundClassName: "bg-notice-banner-general",
    fadeClassName: "top-[118px] h-[50px] from-notice-banner-general",
    image: noticeFeedback,
    imageClassName: "top-0 h-[206.3px] w-[335px]",
  },
  general: {
    backgroundClassName: "bg-notice-banner-general",
    fadeClassName: "top-[103px] h-[67px] from-notice-banner-general",
    image: noticeGeneral,
    imageClassName: "top-2 h-[175px] w-[264px]",
  },
  locker: {
    backgroundClassName: "bg-notice-banner-locker",
    fadeClassName: "top-[119px] h-[65px] from-notice-banner-locker",
    image: noticeLocker,
    imageClassName: "top-[21px] h-[168px] w-[303.8px]",
  },
  partnership: {
    backgroundClassName: "bg-notice-banner-partnership",
    fadeClassName: "top-[86px] h-[98px] from-notice-banner-partnership",
    image: noticePartnership,
    imageClassName: "top-8 h-[147px] w-[294px]",
  },
  snack: {
    backgroundClassName: "bg-notice-banner-snack",
    fadeClassName: "top-[85px] h-[99px] from-notice-banner-snack",
    image: noticeSnack,
    imageClassName: "top-[15px] h-[178px] w-[321px]",
  },
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
}

function HomeNoticeCard({ notice, index, total }: HomeNoticeCardProps) {
  const template = NOTICE_TEMPLATES[notice.template];

  return (
    <div
      className={`relative flex h-[261px] w-full shrink-0 snap-start flex-col justify-end overflow-hidden rounded-xl border-[0.5px] border-static-white px-4 py-5 shadow-[0_0_60px_rgba(23,23,23,0.1)] ${template.backgroundClassName}`}
    >
      <img
        alt=""
        className={`absolute left-1/2 -translate-x-1/2 object-cover ${template.imageClassName}`}
        src={template.image}
      />
      <div
        className={`absolute left-0 w-full bg-linear-to-t to-transparent ${template.fadeClassName}`}
      />
      <div className="relative flex items-end justify-between">
        <div className="flex w-[257px] flex-col gap-1">
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

function getStep(scroller: HTMLElement) {
  return (scroller.firstElementChild as HTMLElement).offsetWidth + CARD_GAP;
}

// 5초마다 다음 카드로 넘어가고, 손으로 넘기면 그때부터 다시 5초를 센다. 배너가 하나면 넘기지 않는다.
// 마지막 카드 오른쪽에 첫 카드 복제본을 두어 끝에서도 같은 방향으로 이어지고, 복제본에 멈추면
// 진짜 첫 카드 위치로 순간 이동한다.
// 카드 폭은 화면 폭 - 40이라 화면이 넓어져도 다음 카드는 12px만 보인다(Figma 375 기준 335).
// 가로 스크롤 영역이 카드 그림자(Shadow/Spread/Small, 60px)를 자르지 않게 위아래로 60px 넓힌다.
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

    // 스크롤이 멈추면(scrollend 미지원 WebView를 위해 scroll 디바운스) 복제본인지 확인한다
    let settleTimer = 0;
    const handleScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (
          Math.round(scroller.scrollLeft / getStep(scroller)) >= items.length
        ) {
          scroller.scrollTo({ behavior: "instant", left: 0 });
        }
      }, 150);
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });

    let slideTimer = 0;
    const restartSlide = () => {
      window.clearInterval(slideTimer);
      if (prefersReducedMotion) {
        return;
      }
      slideTimer = window.setInterval(() => {
        const step = getStep(scroller);
        const next = Math.round(scroller.scrollLeft / step) + 1;
        scroller.scrollTo({ behavior: "smooth", left: next * step });
      }, AUTO_SLIDE_MS);
    };
    restartSlide();
    scroller.addEventListener("pointerdown", restartSlide);
    scroller.addEventListener("touchstart", restartSlide, { passive: true });

    return () => {
      window.clearTimeout(settleTimer);
      window.clearInterval(slideTimer);
      scroller.removeEventListener("scroll", handleScroll);
      scroller.removeEventListener("pointerdown", restartSlide);
      scroller.removeEventListener("touchstart", restartSlide);
    };
  }, [canSlide, prefersReducedMotion, items.length]);

  return (
    <div
      className={`scrollbar-hidden -my-[60px] flex gap-2 px-5 py-[60px] ${canSlide ? "snap-x snap-mandatory scroll-px-5 overflow-x-auto" : "overflow-hidden"}`}
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
        <div aria-hidden className="contents">
          <HomeNoticeCard index={0} notice={items[0]} total={items.length} />
        </div>
      )}
    </div>
  );
}

export default HomeNoticeBanner;
