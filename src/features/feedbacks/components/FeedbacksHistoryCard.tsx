import { ContentBadge, Typography } from "@wanteddev/wds";

import arrowRight from "@/assets/icons/home/arrow-right.svg";
import type { MyFeedback } from "@/entities/feedbacks/types";

interface FeedbacksHistoryCardProps {
  feedback: MyFeedback;
  onSelect: () => void;
}

// Figma: Feedback History Card (nodeId 2663:183140) — Stream 로컬. 답변이 있으면 답변완료(초록),
// 없으면 답변대기(주황) 배지를 붙인다.
function FeedbacksHistoryCard({
  feedback,
  onSelect,
}: FeedbacksHistoryCardProps) {
  const isAnswered = feedback.answer !== undefined;

  return (
    <button
      className="flex w-full flex-col gap-2 rounded-xl bg-background-normal p-4 text-left"
      onClick={onSelect}
      type="button"
    >
      <div className="flex w-full items-center justify-between">
        <ContentBadge
          accentColor={
            isAnswered
              ? "semantic.accent.foreground.green"
              : "semantic.accent.foreground.orange"
          }
          color="accent"
          size="small"
          variant="solid"
        >
          {isAnswered ? "답변완료" : "답변대기"}
        </ContentBadge>
        <img alt="" className="size-3" src={arrowRight} />
      </div>
      <div className="flex flex-col gap-1">
        <Typography
          as="p"
          className="line-clamp-3"
          color="semantic.label.normal"
          variant="label1-reading"
          weight="medium"
        >
          {feedback.question}
        </Typography>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          {feedback.createdAt.replaceAll("-", ".")}
        </Typography>
      </div>
    </button>
  );
}

export default FeedbacksHistoryCard;
