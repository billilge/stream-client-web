import { Button, Typography } from "@wanteddev/wds";

import emptyFeedback from "@/assets/icons/feedbacks/empty-feedback.svg";

interface FeedbacksEmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

// Figma: 열린피드백 작성내역 empty > Empty State (nodeId 3147:147823) — 행사 목록 Empty State와 같은
// 틀(81px 그림 + 타이틀·설명 + 작은 버튼)이고 그림·버튼 색만 다르다. WDS FallbackView를 쓰지 않는 이유도 같다.
function FeedbacksEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: FeedbacksEmptyStateProps) {
  return (
    <div className="flex w-64 flex-col items-center gap-3">
      {/* Figma 그림 자리 81px(size-20.25) */}
      <div className="flex size-20.25 items-center justify-center">
        <img alt="" src={emptyFeedback} />
      </div>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-1">
          <Typography
            align="center"
            color="semantic.label.neutral"
            variant="headline1"
            weight="bold"
          >
            {title}
          </Typography>
          <Typography
            align="center"
            color="semantic.label.alternative"
            variant="label1"
            weight="regular"
          >
            {description}
          </Typography>
        </div>
        <Button
          color="assistive"
          onClick={onAction}
          size="small"
          variant="solid"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

export default FeedbacksEmptyState;
