import { Typography } from "@wanteddev/wds";

interface FeedbacksCardProps {
  question: string;
  round: string;
}

// Figma: Notice Card 패턴 재사용(nodeId 1410:50038) — 게시판-공지 카드(NoticesCard)와 같은
// 로컬 카드 UI지만 도메인이 다르고(feedbacks) 필드도 달라(썸네일·고정 없음, 차수 라벨) 별도로 둔다.
function FeedbacksCard({ question, round }: FeedbacksCardProps) {
  return (
    <div className="flex w-full flex-col gap-1 px-5 py-[7px]">
      <Typography
        color="semantic.label.normal"
        noWrap
        variant="body2"
        weight="medium"
      >
        {question}
      </Typography>
      <Typography
        color="semantic.label.alternative"
        variant="caption1"
        weight="regular"
      >
        {round} 열린 피드백
      </Typography>
    </div>
  );
}

export default FeedbacksCard;
