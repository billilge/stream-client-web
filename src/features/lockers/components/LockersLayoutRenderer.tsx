import { Typography } from "@wanteddev/wds";
import type { CSSProperties } from "react";

import stairsIcon from "@/assets/icons/lockers/stairs.svg";
import LockersLockerGrid from "@/features/lockers/components/LockersLockerGrid";
import LockersMapArea from "@/features/lockers/components/LockersMapArea";
import LockersMapLabel from "@/features/lockers/components/LockersMapLabel";
import LockersShelfLabel from "@/features/lockers/components/LockersShelfLabel";
import type {
  LockersLayout,
  LockersLayoutAlign,
  LockersLayoutAreaBlock,
  LockersLayoutBlock,
  LockersLayoutSize,
  LockersSectionLocker,
} from "@/features/lockers/constants/lockersSectionDetails";

interface LockersLayoutRendererProps {
  layout: LockersLayout;
  /** 구역의 사물함을 lockerNumber로 찾는 표 */
  lockers: ReadonlyMap<number, LockersSectionLocker>;
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

type LockersLayoutBlockContext = Omit<LockersLayoutRendererProps, "layout">;

// 블록이 놓이는 부모의 방향. 같은 "fill"이라도 부모 방향과 같은 축이면 남은 공간을 나눠 갖고(flex-1),
// 다른 축이면 부모 폭·높이에 맞춰 늘어난다(self-stretch).
type LockersLayoutDirection = "row" | "column";

const ALIGN_CLASS_NAMES: Record<LockersLayoutAlign, string> = {
  center: "items-center",
  end: "items-end",
  start: "items-start",
  stretch: "items-stretch",
};

const AREA_ICONS: Record<
  NonNullable<LockersLayoutAreaBlock["icon"]>,
  string
> = {
  stairs: stairsIcon,
};

function getSizing(
  block: LockersLayoutBlock,
  parentDirection: LockersLayoutDirection,
) {
  const isRow = parentDirection === "row";
  const mainSize: LockersLayoutSize =
    (isRow ? block.width : block.height) ?? "hug";
  const crossSize: LockersLayoutSize =
    (isRow ? block.height : block.width) ?? "hug";
  const mainProperty = isRow ? "width" : "height";
  const crossProperty = isRow ? "height" : "width";

  const classNames = [mainSize === "fill" ? "flex-1" : "shrink-0"];
  const style: CSSProperties = {};

  if (typeof mainSize === "number") {
    style[mainProperty] = mainSize;
  }
  if (crossSize === "fill") {
    classNames.push("self-stretch");
  } else if (typeof crossSize === "number") {
    style[crossProperty] = crossSize;
  }

  return { className: classNames.join(" "), style };
}

function LockersLayoutBlockView({
  block,
  parentDirection,
  context,
}: {
  block: LockersLayoutBlock;
  parentDirection: LockersLayoutDirection;
  context: LockersLayoutBlockContext;
}) {
  const sizing = getSizing(block, parentDirection);

  switch (block.type) {
    case "row":
    case "column":
      return (
        <div
          className={`flex ${block.type === "row" ? "flex-row" : "flex-col"} ${
            ALIGN_CLASS_NAMES[block.align ?? "start"]
          } ${sizing.className}`}
          style={{ ...sizing.style, gap: block.gap }}
        >
          {block.children.map((child, index) => (
            <LockersLayoutBlockView
              block={child}
              context={context}
              // biome-ignore lint/suspicious/noArrayIndexKey: layout 자식은 순서가 곧 배치라 순서가 바뀌지 않고, 블록마다 고유한 값이 없다
              key={index}
              parentDirection={block.type}
            />
          ))}
        </div>
      );
    case "lockerGroup": {
      const grid = (
        <LockersLockerGrid
          lockers={context.lockers}
          onSelect={context.onSelect}
          rows={block.rows}
          selectedLockerNumber={context.selectedLockerNumber}
        />
      );
      // Figma: Zone Area (nodeId 2159:110831 외) — 칸 묶음을 감싸는 테두리
      return block.bordered ? (
        <div
          className={`rounded-lg border border-line-solid-alternative p-3 ${sizing.className}`}
          style={sizing.style}
        >
          {grid}
        </div>
      ) : (
        <div className={sizing.className} style={sizing.style}>
          {grid}
        </div>
      );
    }
    case "label":
      return (
        <LockersMapLabel
          className={sizing.className}
          orientation={block.orientation}
          style={sizing.style}
          text={block.text}
        />
      );
    case "area":
      return (
        <LockersMapArea
          // 높이를 따로 주지 않으면 Figma Room Label처럼 위아래 32px 여백으로 높이를 낸다
          className={`${sizing.className} ${block.height === undefined || block.height === "hug" ? "py-8" : ""}`}
          icon={block.icon === undefined ? undefined : AREA_ICONS[block.icon]}
          label={block.text}
          style={sizing.style}
        />
      );
    case "text":
      return (
        <div className={sizing.className} style={sizing.style}>
          <Typography
            as="p"
            color="semantic.label.alternative"
            sx={{ textAlign: "center" }}
            variant="caption1"
            weight="medium"
          >
            {block.text}
          </Typography>
        </div>
      );
    case "shelfLabel":
      return (
        <LockersShelfLabel
          height={typeof block.height === "number" ? block.height : undefined}
        />
      );
    default:
      // 서버가 이 버전의 프론트가 모르는 블록을 보내도 화면 전체가 깨지지 않게 그 블록만 건너뛴다
      return null;
  }
}

// layout JSON(블록 7종)을 그대로 그린다. 구역마다 배치 컴포넌트를 따로 두지 않고, 구역별 배치는
// 서버가 주는 layout이 갖는다. 칸 크기·색·간격 같은 디자인 규칙은 각 부품이 갖는다.
//
// 최상위 블록은 부모(가로 스크롤 영역) 폭보다 좁아지지 않는다 — 화면에 다 들어오는 구역에서
// "fill" 상자(A-2의 B-1구역 등)가 화면 끝까지 늘어나게 하려는 것이다.
function LockersLayoutRenderer({
  layout,
  ...context
}: LockersLayoutRendererProps) {
  return (
    <div className="flex w-max min-w-full">
      <LockersLayoutBlockView
        block={{ ...layout.root, width: layout.root.width ?? "fill" }}
        context={context}
        parentDirection="row"
      />
    </div>
  );
}

export default LockersLayoutRenderer;
