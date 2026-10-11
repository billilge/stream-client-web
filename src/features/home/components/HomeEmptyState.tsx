import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

interface HomeEmptyStateProps {
  illustration: ReactNode;
  message: string;
  action: ReactNode;
}

// Figma: 홈 empty의 Empty State (nodeId 3562:163927, 3562:163941) — 대여·신청 행사가 같은 모양이다
function HomeEmptyState({
  illustration,
  message,
  action,
}: HomeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-background-normal p-4">
      <div className="flex size-11 items-center justify-center">
        {illustration}
      </div>
      <div className="flex flex-col items-center gap-3">
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="label2"
          weight="regular"
        >
          {message}
        </Typography>
        {action}
      </div>
    </div>
  );
}

export default HomeEmptyState;
