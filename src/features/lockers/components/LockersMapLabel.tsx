import { Typography } from "@wanteddev/wds";

interface LockersMapLabelProps {
  text: string;
  orientation?: "horizontal" | "vertical";
  /** 크기(창문 폭, 벽면 높이 등) — 화면마다 다르다 */
  className?: string;
}

// 세로 라벨은 Figma가 한 글자씩 줄을 바꾸고 단어 사이에 빈 줄을 둔다("왼쪽 벽면" → 왼/쪽/ /벽/면).
function toVerticalText(text: string) {
  return [...text].map((char) => (char === " " ? "" : char)).join("\n");
}

// Figma: 창문·벽면처럼 고를 수 없는 자리(Direction Label·Aisle) — Stream 로컬. 회색 면에 라벨을 둔다.
// 가로(창문)는 위아래, 세로(벽면)는 좌우에만 여백을 둔다.
function LockersMapLabel({
  text,
  orientation = "horizontal",
  className = "",
}: LockersMapLabelProps) {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={`flex items-center justify-center rounded-sm bg-background-alternative ${
        isVertical ? "px-1.5" : "py-1.5"
      } ${className}`}
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
