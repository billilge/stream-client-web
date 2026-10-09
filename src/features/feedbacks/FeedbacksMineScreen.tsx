import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import FeedbacksMineList from "@/features/feedbacks/components/FeedbacksMineList";
import FeedbacksMineSkeleton from "@/features/feedbacks/components/FeedbacksMineSkeleton";

// Figma: 열린피드백 작성내역 (nodeId 3147:147748)
function FeedbacksMineScreen() {
  const navigate = useNavigate();

  // 바로 들어와 뒤로 갈 히스토리가 없으면 홈으로 보낸다(행사 신청 화면과 같은 이유)
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
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
      title="열린피드백 작성내역"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<FeedbacksMineSkeleton />}>
        <FeedbacksMineList
          onSelect={(feedbackId) =>
            navigate(`/my/feedbacks/${feedbackId}`, { viewTransition: true })
          }
          onWrite={() => navigate("/feedbacks/new", { viewTransition: true })}
        />
      </Suspense>
    </div>
  );
}

export default FeedbacksMineScreen;
