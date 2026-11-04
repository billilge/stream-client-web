import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import emptyFeedbackIllustration from "@/assets/icons/feedbacks/empty-feedback.svg";
import EmptyState from "@/components/ui/EmptyState";
import FeedbacksHistoryCard from "@/features/feedbacks/components/FeedbacksHistoryCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";

interface FeedbacksMineListProps {
  onSelect: (feedbackId: number) => void;
  onWrite: () => void;
}

// Figma: 열린피드백 작성내역 (nodeId 3147:147748), empty (3147:147818)
function FeedbacksMineList({ onSelect, onWrite }: FeedbacksMineListProps) {
  const {
    data: feedbacks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...feedbacksQueries.mine(),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });

  if (feedbacks.length === 0) {
    // Figma는 헤더 아래 200px 지점에 빈 상태를 둔다
    return (
      <div className="flex justify-center pt-50">
        <EmptyState
          action={{
            label: "열린피드백 작성하기",
            onClick: onWrite,
            variant: "solid",
          }}
          description="학생회에 전하고 싶은 의견을 남겨 보세요."
          illustration={emptyFeedbackIllustration}
          title="작성한 피드백이 없어요"
        />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="flex flex-col gap-2 px-5">
        {feedbacks.map((feedback) => (
          <FeedbacksHistoryCard
            feedback={feedback}
            key={feedback.feedbackId}
            onSelect={() => onSelect(feedback.feedbackId)}
          />
        ))}
      </div>
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </div>
  );
}

export default FeedbacksMineList;
