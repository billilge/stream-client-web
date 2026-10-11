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
  lockers: ReadonlyMap<number, LockersSectionLocker>;
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

type LockersLayoutBlockContext = Omit<LockersLayoutRendererProps, "layout">;

// "fill"은 부모와 같은 축이면 남은 공간을 나눠 갖고(flex-1), 다른 축이면 부모에 맞춰 늘어난다
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
          // 높이가 없으면 Figma Room Label처럼 위아래 32px 여백으로 높이를 낸다
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
      // 모르는 블록은 화면 전체가 깨지지 않게 건너뛴다
      return null;
  }
}

// 최상위 블록은 부모 폭보다 좁아지지 않게 해서, 화면보다 좁은 구역의 "fill" 상자가 화면 끝까지 늘어난다
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
