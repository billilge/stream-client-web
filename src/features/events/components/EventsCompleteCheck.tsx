import { LottieLight } from "lottie-react";

import completeCheck from "@/assets/lottie/events/complete-check.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Figma: Circle Check Motion (nodeId 1712:192849), 완료 화면에 놓인 인스턴스는 1712:192851.
// 원이 튀어올랐다 자리를 잡고(back-out) 체크 선이 그려진다(path trim). 타임라인은 2초 1회
// 재생인데 실제 움직임은 앞 0.55초에 끝나고 나머지는 멈춰 있는 구간이다.
//
// 모션은 Figma LottieFiles 플러그인으로 뽑은 Lottie를 그대로 재생한다 — 자세한 규칙은
// component-convention.md "모션 (Lottie)" 참고. 이 파일은 export 원본을 가공 없이 쓴다.

// 모션 줄이기를 켠 사용자에게는 다 그려진 한 프레임만 세워둔다. 33프레임에서 체크가 완성된다.
const DRAWN_SEGMENT = [33, 34] as const;

function EventsCompleteCheck() {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <LottieLight
      aria-hidden
      // lottie-react가 모션 줄이기면 자체적으로 재생을 막지만, autoplay를 켠 채로 두면
      // 그때마다 개발 콘솔에 경고를 남긴다. 우리가 먼저 꺼서 그 경고를 만들지 않는다.
      autoplay={!shouldReduceMotion}
      className="size-[72px]"
      loop={false}
      segment={shouldReduceMotion ? DRAWN_SEGMENT : undefined}
      src={completeCheck}
    />
  );
}

export default EventsCompleteCheck;
