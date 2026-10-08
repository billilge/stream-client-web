import { LottieLight } from "lottie-react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface FeeLottieIconProps {
  /** LottieFiles 플러그인으로 받은 Figma Motion json */
  animation: object;
  /**
   * 움직임이 끝나 값이 고정되는 프레임. 타임라인은 2초지만 실제 움직임은 앞부분에서 끝나고
   * 나머지는 멈춰 있는 구간이라, 모션 줄이기일 때 이 한 장만 세워 둔다.
   */
  settledFrame: number;
  /** 스크린리더에 읽힐 이름. 장식이면 생략한다 */
  label?: string;
}

// 송금 플로우의 48px 일러스트 두 개(₩ 3562:163032, 종이비행기 3562:162980)가 공유하는 재생기.
// 둘 다 Figma Motion이 붙어 있어 키프레임을 손으로 옮기지 않고 Lottie로 받아 재생한다
// (component-convention.md "모션 (Lottie)").
//
// `LottieLight`를 쓰는 이유는 완료 체크(CompleteCheck)와 같다 — 풀 빌드는 canvas·HTML 렌더러와
// `eval` 기반 표현식 엔진까지 끌고 와서 번들이 커지고 WebView CSP에서 깨질 수 있다.
function FeeLottieIcon({ animation, settledFrame, label }: FeeLottieIconProps) {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <LottieLight
      aria-hidden={label ? undefined : true}
      aria-label={label}
      // lottie-react가 모션 줄이기면 자체적으로 재생을 막지만, autoplay를 켠 채로 두면
      // 그때마다 개발 콘솔에 경고를 남긴다. 우리가 먼저 꺼서 그 경고를 만들지 않는다.
      autoplay={!shouldReduceMotion}
      className="size-12"
      loop={false}
      role={label ? "img" : undefined}
      segment={
        shouldReduceMotion ? [settledFrame, settledFrame + 1] : undefined
      }
      src={animation}
    />
  );
}

export default FeeLottieIcon;
