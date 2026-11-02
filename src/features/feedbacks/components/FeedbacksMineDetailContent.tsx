import { Button, Typography } from "@wanteddev/wds";
import { use } from "react";
import { Navigate } from "react-router-dom";

import answerIcon from "@/assets/icons/feedbacks/answer.svg";
import emptyFeedbackIllustration from "@/assets/icons/feedbacks/empty-feedback.svg";
import questionIcon from "@/assets/icons/feedbacks/question.svg";
import EmptyState from "@/components/ui/EmptyState";
import { fetchMyFeedback } from "@/entities/feedbacks/feedbacksApi";
import FeedbacksAnswerText from "@/features/feedbacks/components/FeedbacksAnswerText";
import { hasFeedbackAnswer } from "@/features/feedbacks/constants/feedbacks";

interface FeedbacksMineDetailContentProps {
  feedbackId: string;
  /** 없는 피드백이면 보낼 곳 — 이동할 경로는 화면이 정한다 */
  fallbackPath: string;
  onBrowseFeedbacks: () => void;
  onViewRound: (feedbackId: string) => void;
}

// Figma: 열린피드백 작성내역 상세 답변완료 (nodeId 3147:147756), 답변대기 (3147:147779)
// 질문·답변 머리(32px 배경 원 + 아이콘)는 열린피드백 상세(FeedbacksDetailScreen)와 같다.
function FeedbacksMineDetailContent({
  feedbackId,
  fallbackPath,
  onBrowseFeedbacks,
  onViewRound,
}: FeedbacksMineDetailContentProps) {
  const feedback = use(fetchMyFeedback(feedbackId));

  if (!feedback) {
    return <Navigate replace to={fallbackPath} />;
  }

  // 목록 카드와 같은 기준(hasFeedbackAnswer)으로 답변이 있는지 본다
  const answer = hasFeedbackAnswer(feedback) ? feedback.answer : undefined;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-alternative">
            <img alt="" className="size-5" src={questionIcon} />
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography
              color="semantic.label.neutral"
              variant="label2"
              weight="medium"
            >
              피드백 내용
            </Typography>
            <Typography
              color="semantic.label.alternative"
              variant="caption2"
              weight="regular"
            >
              {feedback.createdAt}
            </Typography>
          </div>
        </div>
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="body2-reading"
          weight="medium"
        >
          {feedback.question}
        </Typography>
      </div>

      <div className="h-2 w-full bg-background-alternative" />

      <div className={`flex flex-col px-5 ${answer ? "gap-3" : "gap-10"}`}>
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background-alternative">
            <img alt="" className="size-4" src={answerIcon} />
          </div>
          <div className="flex flex-col gap-0.5">
            <Typography
              color="semantic.label.neutral"
              variant="label2"
              weight="medium"
            >
              학생회 답변
            </Typography>
            <Typography
              color="semantic.label.alternative"
              variant="caption2"
              weight="regular"
            >
              {feedback.answerDate ?? "-"}
            </Typography>
          </div>
        </div>

        {answer ? (
          <div className="flex flex-col items-center gap-8">
            <FeedbacksAnswerText text={answer} />
            <Button
              color="primary"
              onClick={() => onViewRound(feedback.id)}
              size="medium"
              variant="outlined"
            >
              해당 회차 답변 모아보기
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <EmptyState
              action={{
                label: "열린피드백 보러 가기",
                onClick: onBrowseFeedbacks,
                variant: "solid",
              }}
              description="다른 피드백 답변을 구경해 보세요"
              illustration={emptyFeedbackIllustration}
              title="학생회에서 답변을 준비 중이에요"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbacksMineDetailContent;
