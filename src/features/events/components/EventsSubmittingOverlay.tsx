import { Typography } from "@wanteddev/wds";
import {
  type Easing,
  motion,
  type TargetAndTransition,
  type Transition,
  useReducedMotion,
} from "motion/react";
import { createPortal } from "react-dom";

import submittingDocument from "@/assets/icons/events/submitting-document.svg";
import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

// Figma: 행사 로딩 (nodeId 1133:43453), 모션은 Loading / Document Review (1133:44260).
// 3.4초 루프 안에서 체크·긴 줄·짧은 줄이 순서대로 그려지고 마지막에 함께 사라진다.
// 아래 타이밍·이징 값은 Figma 모션 데이터를 그대로 옮긴 것이다.
const DURATION = 3.4;
const STROKE_WIDTH = 3.50787;

// 9개 요소가 공유하는 사라짐 타이밍
const FADE_OUT_KEYFRAMES: TargetAndTransition = { opacity: [1, 1, 0, 0] };
const FADE_OUT_TRANSITION: Transition = {
  duration: DURATION,
  ease: ["linear", "easeInOut", "linear"],
  repeat: Number.POSITIVE_INFINITY,
  times: [0, 0.8882, 0.9765, 1],
};

// 선이 그려지는 구간만 요소마다 다르다(start~end). strokeDasharray는 pathLength=1 기준이다.
// visibility도 같이 껐다 켠다 — 선 끝이 둥글어서(strokeLinecap) 길이 0인 선이 점으로 찍히는데,
// Figma도 같은 이유로 그려지기 전까지 hidden으로 둔다.
const DRAW_KEYFRAMES: TargetAndTransition = {
  strokeDasharray: ["0 1", "0 1", "1 1", "1 1", "0 1"],
  visibility: ["hidden", "hidden", "visible", "visible", "hidden"],
};
const DRAW_EASE: Easing[] = ["easeInOut", "easeInOut", "easeInOut", "linear"];

const SHAPES = {
  check: {
    d: "M1.75395 8.24349L6.13878 13.1545L16.8378 1.75394",
    height: 14.9084,
    stroke: "var(--color-primary)",
    width: 18.5917,
  },
  long: {
    d: "M1.75393 1.75393H54.635",
    height: 3.50787,
    stroke: "var(--color-submitting-line)",
    width: 56.3889,
  },
  short: {
    d: "M1.75393 1.75393H29.4661",
    height: 3.50787,
    stroke: "var(--color-submitting-line)",
    width: 31.22,
  },
} as const;

// 문서 안 체크 항목 3줄. top은 문서 기준 위치, start/end는 그 요소가 그려지는 구간이다.
const ITEMS = [
  {
    check: [0.024, 0.124],
    long: [0.129, 0.247],
    short: [0.171, 0.288],
    top: 39.67,
  },
  {
    check: [0.303, 0.403],
    long: [0.409, 0.526],
    short: [0.45, 0.568],
    top: 73.35,
  },
  {
    check: [0.582, 0.682],
    long: [0.688, 0.806],
    short: [0.729, 0.847],
    top: 107.02,
  },
] as const;

const ITEM_LEFT = 28.44;
// 선 굵기의 절반만큼 도형이 좌표 밖으로 나가서, Figma 좌표에서 그만큼 빼서 놓는다
const STROKE_OFFSET = STROKE_WIDTH / 2;

interface DrawnShapeProps {
  shape: keyof typeof SHAPES;
  /** 그리기 시작·끝 시점(0~1, 3.4초 기준) */
  start: number;
  end: number;
  left: number;
  top: number;
  isStatic: boolean;
}

function DrawnShape({
  shape,
  start,
  end,
  left,
  top,
  isStatic,
}: DrawnShapeProps) {
  const { d, height, stroke, width } = SHAPES[shape];
  const path = (
    <path
      d={d}
      pathLength={1}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={STROKE_WIDTH}
    />
  );
  const style = { left: left - STROKE_OFFSET, top: top - STROKE_OFFSET };

  // 모션 줄이기를 켠 사용자에게는 다 그려진 상태로 보여준다
  if (isStatic) {
    return (
      <svg
        aria-hidden
        className="absolute"
        fill="none"
        height={height}
        style={style}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        {path}
      </svg>
    );
  }

  return (
    <motion.svg
      animate={FADE_OUT_KEYFRAMES}
      aria-hidden
      className="absolute"
      fill="none"
      height={height}
      style={style}
      transition={FADE_OUT_TRANSITION}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <motion.path
        animate={DRAW_KEYFRAMES}
        d={d}
        initial={{ strokeDasharray: "0 1", visibility: "hidden" }}
        pathLength={1}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={STROKE_WIDTH}
        transition={{
          duration: DURATION,
          ease: DRAW_EASE,
          repeat: Number.POSITIVE_INFINITY,
          times: [0, start, end, 1, 1],
        }}
      />
    </motion.svg>
  );
}

// 제출 중 화면 — Figma에 헤더가 없어서 화면 포털에 흰 배경으로 프레임 전체를 덮는다.
function EventsSubmittingOverlay({ open }: { open: boolean }) {
  const portalEl = useScreenSheetPortal();
  const shouldReduceMotion = useReducedMotion();

  if (!portalEl || !open) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-[35px] bg-background-normal px-5">
      <div className="relative h-[171.077px] w-[139px]">
        {/* 뒤에 살짝 기울어져 보이는 파란 문서 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[159.879px] w-[124.209px] rotate-[5.52deg] rounded-[6.885px] bg-primary-subtle" />
        </div>
        <img
          alt=""
          className="absolute h-[150.35px] w-[113.863px]"
          src={submittingDocument}
          style={{ left: 17.85, top: 10.74 }}
        />
        {ITEMS.map((item) => (
          <div key={item.top}>
            <div
              className="absolute h-[21.398px] w-[21.749px] rounded-[5.613px] bg-submitting-checkbox"
              style={{ left: ITEM_LEFT, top: item.top }}
            />
            <DrawnShape
              end={item.check[1]}
              isStatic={Boolean(shouldReduceMotion)}
              left={ITEM_LEFT + 5.96}
              shape="check"
              start={item.check[0]}
              top={item.top + 3.95}
            />
            <DrawnShape
              end={item.long[1]}
              isStatic={Boolean(shouldReduceMotion)}
              left={ITEM_LEFT + 31.57}
              shape="long"
              start={item.long[0]}
              top={item.top + 7.89}
            />
            <DrawnShape
              end={item.short[1]}
              isStatic={Boolean(shouldReduceMotion)}
              left={ITEM_LEFT + 31.57}
              shape="short"
              start={item.short[0]}
              top={item.top + 17.36}
            />
          </div>
        ))}
      </div>

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
