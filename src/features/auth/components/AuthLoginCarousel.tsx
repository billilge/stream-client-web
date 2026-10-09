import { Typography } from "@wanteddev/wds";
import { useRef, useState } from "react";

import illustrationCircle from "@/assets/icons/auth/illustration-circle.svg";
import AuthPaginationDots from "@/features/auth/components/AuthPaginationDots";
import { LOGIN_SLIDES } from "@/features/auth/constants/auth";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Figma: Login Feature Content (nodeId 3658:113307) — 일러스트 320×240 + 문구, 아래에 페이지네이션 닷.
// 화면설계서 2번: 자동 전환은 없고 사용자가 스와이프로 다음·이전 슬라이드로 넘기며, 닷으로 현재 순서를
// 보여 준다. 문구와 닷 사이는 Figma가 28px로 보이지만 Login Copy 프레임이 50px로 고정돼 문구(54px)가 4px 넘치는
// 값이라, 실제 문구 끝에서 닷까지는 24px이다. 스와이프는 네이티브 가로 스크롤 + scroll-snap이라 따로 제스처 코드를 두지 않는다.
function AuthLoginCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const shouldReduceMotion = usePrefersReducedMotion();

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      setPage(Math.round(scroller.scrollLeft / scroller.clientWidth));
    }
  };

  // 닷을 눌러도 해당 슬라이드로 넘어간다
  const goToPage = (nextPage: number) => {
    const scroller = scrollerRef.current;
    scroller?.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      left: nextPage * scroller.clientWidth,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full">
        {/* 일러스트 뒤 은은한 파란 빛(Figma Illustration Background Circle) — 223×138 타원 둘레로 번지는
            623×538 이미지라 슬라이드 스크롤 영역 안에 두면 잘려서, 모든 슬라이드가 같은 자리를 쓰는 점을 이용해
            스크롤 영역 밖에 한 번만 그린다. 화면 폭을 넘는 부분만 잘라 가로 스크롤이 생기지 않게 한다. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-37.25 h-134.5 overflow-hidden"
        >
          <img
            alt=""
            className="absolute left-1/2 h-134.5 w-155.75 max-w-none -translate-x-1/2"
            src={illustrationCircle}
          />
        </div>

        <div
          className="scrollbar-hidden relative flex w-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleScroll}
          ref={scrollerRef}
        >
          {LOGIN_SLIDES.map((slide) => (
            <div
              className="flex w-full shrink-0 snap-center flex-col items-center gap-8"
              key={slide.id}
            >
              <img
                alt=""
                className="h-60 w-80 object-cover"
                src={slide.image}
              />
              <div className="flex flex-col items-center gap-1 px-2.5 text-center">
                <Typography
                  as="p"
                  color="semantic.label.strong"
                  variant="heading2"
                  weight="bold"
                >
                  {slide.title}
                </Typography>
                <Typography
                  as="p"
                  color="semantic.label.alternative"
                  variant="body2"
                  weight="regular"
                >
                  {slide.description}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AuthPaginationDots
        currentPage={page}
        onSelect={goToPage}
        totalPages={LOGIN_SLIDES.length}
      />
    </div>
  );
}

export default AuthLoginCarousel;
