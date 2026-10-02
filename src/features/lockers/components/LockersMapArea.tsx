import { Typography } from "@wanteddev/wds";
import type { CSSProperties } from "react";

interface LockersMapAreaProps {
  label: string;
  icon?: string;
  className?: string;
  style?: CSSProperties;
}

// Figma: Room Label·Zone Label·Stairs Area — 호실·계단처럼 고를 수 없는 자리
function LockersMapArea({
  label,
  icon,
  className = "",
  style,
}: LockersMapAreaProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line-solid-normal border-dashed bg-background-normal ${className}`}
      style={style}
    >
      <div className="flex items-center gap-0.5">
        {icon !== undefined && (
          <img alt="" className="size-6 shrink-0" src={icon} />
        )}
        <Typography
          as="p"
          color="semantic.label.assistive"
          variant="caption1"
          weight="medium"
        >
          {label}
        </Typography>
      </div>
    </div>
  );
}

export default LockersMapArea;
