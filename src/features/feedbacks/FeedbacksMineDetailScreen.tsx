import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksMineDetailContent from "@/features/feedbacks/components/FeedbacksMineDetailContent";
import FeedbacksMineDetailSkeleton from "@/features/feedbacks/components/FeedbacksMineDetailSkeleton";
import {
  getFeedbackPath,
  MY_FEEDBACKS_PATH,
} from "@/features/feedbacks/constants/feedbacks";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// Figma: 열린피드백 작성내역 상세 (nodeId 3147:147756 답변완료, 3147:147779 답변대기)
function FeedbacksMineDetailScreen() {
  const navigate = useNavigate();
  const { feedbackId = "" } = useParams();
  const feedbackNumber = Number(feedbackId);

  // 바로 들어와 뒤로 갈 히스토리가 없으면 작성내역 목록으로 보낸다
  const goBack = useBackNavigation(MY_FEEDBACKS_PATH);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="작성내역 상세"
      variant="normal"
    />,
  );

  // 숫자가 아닌 주소로 들어오면 없는 피드백과 같게 작성내역 목록으로 보낸다
  if (!Number.isInteger(feedbackNumber)) {
    return <Navigate replace to={MY_FEEDBACKS_PATH} />;
  }

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<FeedbacksMineDetailSkeleton />}>
        <FeedbacksMineDetailContent
          fallbackPath={MY_FEEDBACKS_PATH}
          feedbackId={feedbackNumber}
          onBrowseFeedbacks={() =>
            navigate("/feedbacks", { viewTransition: true })
          }
          onViewRound={(id) =>
            navigate(getFeedbackPath(id), { viewTransition: true })
          }
        />
      </Suspense>
    </div>
  );
}

export default FeedbacksMineDetailScreen;
