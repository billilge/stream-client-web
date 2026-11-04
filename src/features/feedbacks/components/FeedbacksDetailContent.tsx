import { useSuspenseQuery } from "@tanstack/react-query";

import FeedbacksNotFound from "@/features/feedbacks/components/FeedbacksNotFound";
import FeedbacksRoundDetail from "@/features/feedbacks/components/FeedbacksRoundDetail";
import { hasFeedbackAnswer } from "@/features/feedbacks/constants/feedbacks";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";

interface FeedbacksDetailContentProps {
  feedbackId: number;
  onClose: () => void;
}

// 열린피드백 상세 데이터를 받아 그리는 부분. 데이터를 받는 동안은 FeedbacksDetailScreen의 Suspense가
// FeedbacksDetailSkeleton을 보여준다. 누른 피드백으로 그 회차(연도+차수)를 알아낸 뒤에 같은 회차의 피드백을 받는다.
// 모아보기에는 답변이 있는 피드백만 그릴 수 있어서, 답변이 없는 피드백(내 질문을 주소로 직접 연 경우 등)도 없는 것으로 본다.
function FeedbacksDetailContent({
  feedbackId,
  onClose,
}: FeedbacksDetailContentProps) {
  const { data: feedback } = useSuspenseQuery(
    feedbacksQueries.detail(feedbackId),
  );

  if (!feedback || !hasFeedbackAnswer(feedback)) {
    return <FeedbacksNotFound onClose={onClose} />;
  }
  return <FeedbacksRoundDetail feedback={feedback} onClose={onClose} />;
}

export default FeedbacksDetailContent;
