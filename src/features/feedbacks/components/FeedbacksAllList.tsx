import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Divider } from "@wanteddev/wds";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import FeedbacksCard from "@/features/feedbacks/components/FeedbacksCard";
import {
  formatFeedbackRound,
  getFeedbackPath,
} from "@/features/feedbacks/constants/feedbacks";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";

interface FeedbacksAllListProps {
  year: number | null;
  round: number | null;
}

// "전체 피드백" 목록 — 답변이 공개된 피드백만 오므로 카드는 모두 모아보기로 이어진다.
// 연도·차수는 서버가 걸러 주고, 스크롤이 끝에 닿으면 다음 페이지를 이어 받는다.
function FeedbacksAllList({ year, round }: FeedbacksAllListProps) {
  const {
    data: feedbacks,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...feedbacksQueries.list(year, round),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });

  return (
    <div className="flex flex-col gap-3">
      {feedbacks.map((feedback, index) => (
        <Fragment key={feedback.feedbackId}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <Link className="block" to={getFeedbackPath(feedback.feedbackId)}>
            <FeedbacksCard
              question={feedback.question}
              round={formatFeedbackRound(feedback.round)}
            />
          </Link>
        </Fragment>
      ))}
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </div>
  );
}

export default FeedbacksAllList;
