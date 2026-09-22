import { Typography } from "@wanteddev/wds";
import { LottieLight } from "lottie-react";
import { createPortal } from "react-dom";

import submittingDocument from "@/assets/lottie/events/submitting.json";
import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Figma: 행사 로딩 (nodeId 1133:43453), 모션은 Loading / Document Review (1133:44260).
// 3.4초 루프 안에서 체크·긴 줄·짧은 줄이 순서대로 그려지고 마지막에 함께 사라진다.
//
// 모션은 Figma LottieFiles 플러그인으로 뽑은 Lottie를 그대로 재생한다 — 자세한 규칙은
// component-convention.md "모션 (Lottie)" 참고.
//
// 이 json은 export 원본(`Loading Content`, 375×260)을 가공한 것이다: 원본에는 아래 문구
// 2줄이 벡터 도형(`ind 1~3`)으로 같이 들어 있는데, 도형이 되면 스크린리더가 못 읽고 타이포
// 토큰도 안 따라가서 그 레이어를 빼고 컴포지션을 일러스트 경계(139×171.08)로 잘랐다.
// 문구는 아래 `Typography`가 그린다. 다시 export하면 같은 가공을 해야 한다.

// 모션 줄이기를 켠 사용자에게는 다 그려진 한 프레임만 세워둔다.
// 173프레임에 모든 선이 완성되고 181프레임부터 함께 사라지기 시작한다.
const DRAWN_SEGMENT = [175, 176] as const;

// 제출 중 화면 — Figma에 헤더가 없어서 화면 포털에 흰 배경으로 프레임 전체를 덮는다.
function EventsSubmittingOverlay({ open }: { open: boolean }) {
  const portalEl = useScreenSheetPortal();
  const shouldReduceMotion = usePrefersReducedMotion();

  if (!portalEl || !open) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-[35px] bg-background-normal px-5">
      <LottieLight
        aria-hidden
        // lottie-react가 모션 줄이기면 자체적으로 재생을 막지만, autoplay를 켠 채로 두면
        // 그때마다 개발 콘솔에 경고를 남긴다. 우리가 먼저 꺼서 그 경고를 만들지 않는다.
        autoplay={!shouldReduceMotion}
        className="h-[171.08px] w-[139px]"
        loop={!shouldReduceMotion}
        segment={shouldReduceMotion ? DRAWN_SEGMENT : undefined}
        src={submittingDocument}
      />

      <div className="flex flex-col items-center gap-1 text-center">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="heading1"
          weight="bold"
        >
          신청서를 제출하고 있어요
        </Typography>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          곧 완료돼요! 잠시만 기다려 주세요
        </Typography>
      </div>
    </div>,
    portalEl,
  );
}

export default EventsSubmittingOverlay;
