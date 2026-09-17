import type { TargetAndTransition, Transition } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

// Figma: Circle Check (nodeId 1712:192849) + 모션(Circle Background 1712:192426, Checkmark 1712:192427).
// 타임라인은 2초 1회 재생인데, 실제 움직임은 앞 0.55초에 끝나고 나머지는 멈춰 있는 구간이다
// (Figma 타임라인 길이를 그대로 가져온 값이라 시점 비율도 원본 그대로 둔다).
const DURATION = 2;

const CIRCLE_INITIAL: TargetAndTransition = {
  opacity: 0,
  scaleX: 0,
  scaleY: 0,
};
const CIRCLE_ANIMATE: TargetAndTransition = {
  opacity: [0, 1, 1],
  scaleX: [0, 1, 1],
  scaleY: [0, 1, 1],
};
// 원은 살짝 튀어나왔다 자리를 잡는다(cubic-bezier back-out)
const CIRCLE_TRANSITION: Transition = {
  opacity: {
    duration: DURATION,
    ease: ["easeOut", "linear"],
    times: [0, 0.075, 1],
  },
  scaleX: {
    duration: DURATION,
    ease: [[0.175, 0.885, 0.32, 1.275], "linear"],
    times: [0, 0.225, 1],
  },
  scaleY: {
    duration: DURATION,
    ease: [[0.175, 0.885, 0.32, 1.275], "linear"],
    times: [0, 0.225, 1],
  },
};

// 체크는 선을 그려 나가는 모션(path trim)이라 <img>가 아니라 path를 직접 그린다.
// 그려지기 전까지는 visibility로 숨긴다 — 선 끝이 둥글어서 길이 0인 선이 점으로 찍힌다(Figma도 같다).
const CHECK_INITIAL: TargetAndTransition = {
  strokeDasharray: "0 1",
  visibility: "hidden",
};
const CHECK_ANIMATE: TargetAndTransition = {
  strokeDasharray: ["0 1", "0 1", "1 1", "1 1"],
  visibility: ["hidden", "hidden", "visible", "visible"],
};
const CHECK_TRANSITION: Transition = {
  duration: DURATION,
  ease: ["linear", [0.25, 0.1, 0.25, 1], "linear"],
  times: [0, 0.04, 0.275, 1],
};

// 72px 프레임 안에서 원은 가운데 60px(inset 8.33%), 체크는 Figma가 잡아둔 좌표 그대로 얹는다.
function EventsCompleteCheck() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="relative size-[72px]">
      <motion.div
        animate={shouldReduceMotion ? undefined : CIRCLE_ANIMATE}
        className="absolute inset-[8.33%] rounded-full bg-primary"
        initial={shouldReduceMotion ? undefined : CIRCLE_INITIAL}
        transition={CIRCLE_TRANSITION}
      />
      <svg
        className="absolute top-[25.05px] left-[21.3px]"
        fill="none"
        height="21.9"
        viewBox="0 0 29.4 21.9"
        width="29.4"
      >
        <motion.path
          animate={shouldReduceMotion ? undefined : CHECK_ANIMATE}
          d="M2.7 10.8818L10.7294 19.2L26.6999 2.7"
          initial={shouldReduceMotion ? undefined : CHECK_INITIAL}
          pathLength={1}
          stroke="var(--color-static-white)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={5.4}
          transition={CHECK_TRANSITION}
        />
      </svg>
    </div>
  );
}

export default EventsCompleteCheck;
