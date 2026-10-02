import { Typography } from "@wanteddev/wds";
import type { CSSProperties } from "react";

interface LockersMapLabelProps {
  text: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
}

// Figma는 세로 라벨을 한 글자씩 줄바꿈하고 단어 사이에 빈 줄을 둔다
function toVerticalText(text: string) {
  return [...text].map((char) => (char === " " ? "" : char)).join("\n");
}

// Figma: Direction Label·Aisle — 창문·벽면 표시
function LockersMapLabel({
  text,
  orientation = "horizontal",
  className = "",
  style,
}: LockersMapLabelProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`flex items-center justify-center rounded-sm bg-background-alternative ${
        isVertical ? "px-1.5" : "py-1.5"
      } ${className}`}
      style={style}
    >
      <Typography
        as="p"
        color="semantic.label.alternative"
        sx={{ textAlign: "center", whiteSpace: "pre-line" }}
        variant="caption2"
        weight="medium"
      >
        {isVertical ? toVerticalText(text) : text}
      </Typography>
    </div>
  );
}

export default LockersMapLabel;
