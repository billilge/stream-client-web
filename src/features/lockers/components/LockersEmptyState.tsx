import { Typography } from "@wanteddev/wds";

import emptyEventsIllustration from "@/assets/icons/common/empty-events.svg";

interface LockersEmptyStateProps {
  title: string;
}

// Figma: 사물함 배정 상태 empty > Empty State (nodeId 3147:148336) — 행사 목록 Empty State와 같은
// 그림에 타이틀만 있다(설명·버튼 없음). WDS FallbackView를 쓰지 않는 이유는 행사 목록과 같다.
function LockersEmptyState({ title }: LockersEmptyStateProps) {
  return (
    <div className="flex w-66.75 flex-col items-center gap-3">
      {/* Figma 그림 자리 81px(size-20.25) */}
      <div className="flex size-20.25 items-center justify-center">
        <img alt="" src={emptyEventsIllustration} />
      </div>
      <Typography
        align="center"
        color="semantic.label.neutral"
        variant="body2"
        weight="bold"
      >
        {title}
      </Typography>
    </div>
  );
}

export default LockersEmptyState;
