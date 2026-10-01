import { Typography } from "@wanteddev/wds";

import shelfDividerIcon from "@/assets/icons/lockers/shelf-divider.svg";

interface LockersShelfLabelProps {
  /**
   * 칸 묶음 높이(px)에 맞춘다 — 테두리 있는 3행 묶음은 122, 칸만 있는 3행 묶음은 96.
   * 주지 않으면 같은 줄의 높이에 맞춰 늘어난다.
   */
  height?: number;
}

function ShelfText({ children }: { children: string }) {
  return (
    <Typography
      as="p"
      color="semantic.label.assistive"
      sx={{ textAlign: "center", whiteSpace: "nowrap" }}
      variant="caption1"
      weight="medium"
    >
      {children}
    </Typography>
  );
}

// Figma: Shelf Label (nodeId 1628:174373) — Stream 로컬. 칸 묶음 왼쪽에서 위아래 방향을 알려준다.
// 가운데 점선은 Figma가 가로 Divider를 90° 돌려 그린 것이라 같은 방식(컨테이너 단위로 길이를
// 맞춘 뒤 회전)으로 옮긴다. SVG 원본 크기(120×1.2)는 건드리지 않는다.
function LockersShelfLabel({ height }: LockersShelfLabelProps) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center gap-1.5 ${
        height === undefined ? "self-stretch" : ""
      }`}
      style={{ height }}
    >
      <ShelfText>위쪽 칸</ShelfText>
      <div
        className="flex min-h-px w-full flex-1 items-center justify-center"
        style={{ containerType: "size" }}
      >
        <img
          alt=""
          className="h-[1.2px] w-[100cqh] max-w-none rotate-90"
          src={shelfDividerIcon}
        />
      </div>
      <ShelfText>아래쪽 칸</ShelfText>
    </div>
  );
}

export default LockersShelfLabel;
