import { use } from "react";

import { fetchMyFeedbacks } from "@/entities/feedbacks/feedbacksApi";
import FeedbacksEmptyState from "@/features/feedbacks/components/FeedbacksEmptyState";
import FeedbacksHistoryCard from "@/features/feedbacks/components/FeedbacksHistoryCard";

interface FeedbacksMineListProps {
  onSelect: (feedbackId: string) => void;
  onWrite: () => void;
}

// Figma: 열린피드백 작성내역 (nodeId 3147:147748), empty (3147:147818)
function FeedbacksMineList({ onSelect, onWrite }: FeedbacksMineListProps) {
  const feedbacks = use(fetchMyFeedbacks());

  if (feedbacks.length === 0) {
    // Figma는 헤더 아래 200px 지점에 빈 상태를 둔다
    return (
      <div className="flex justify-center pt-50">
        <FeedbacksEmptyState
          actionLabel="열린피드백 작성하기"
          description="학생회에 전하고 싶은 의견을 남겨 보세요."
          onAction={onWrite}
          title="작성한 피드백이 없어요"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 pb-4">
      {feedbacks.map((feedback) => (
        <FeedbacksHistoryCard
          feedback={feedback}
          key={feedback.id}
          onSelect={() => onSelect(feedback.id)}
        />
      ))}
    </div>
  );
}

export default FeedbacksMineList;
