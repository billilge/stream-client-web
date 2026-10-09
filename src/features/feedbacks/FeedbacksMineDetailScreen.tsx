import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksMineDetailContent from "@/features/feedbacks/components/FeedbacksMineDetailContent";
import FeedbacksMineDetailSkeleton from "@/features/feedbacks/components/FeedbacksMineDetailSkeleton";

// Figma: 열린피드백 작성내역 상세 (nodeId 3147:147756 답변완료, 3147:147779 답변대기)
function FeedbacksMineDetailScreen() {
  const navigate = useNavigate();
  const { feedbackId = "" } = useParams();

  // 바로 들어와 뒤로 갈 히스토리가 없으면 작성내역 목록으로 보낸다
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/my/feedbacks", { replace: true });
  };

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

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<FeedbacksMineDetailSkeleton />}>
        <FeedbacksMineDetailContent
          feedbackId={feedbackId}
          onBrowseFeedbacks={() =>
            navigate("/feedbacks", { viewTransition: true })
          }
          onViewRound={(id) =>
            navigate(`/feedbacks/${id}`, { viewTransition: true })
          }
        />
      </Suspense>
    </div>
  );
}

export default FeedbacksMineDetailScreen;
