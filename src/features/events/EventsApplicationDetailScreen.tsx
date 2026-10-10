import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsApplicationDetailContent from "@/features/events/components/EventsApplicationDetailContent";
import EventsApplicationDetailSkeleton from "@/features/events/components/EventsApplicationDetailSkeleton";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 상세 (1133:46216)
function EventsApplicationDetailScreen() {
  const { applicationId = "" } = useParams();
  const navigate = useNavigate();

  // 바로 들어와 뒤로 갈 히스토리가 없으면 신청내역 목록으로 보낸다
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(EVENTS_TAB_PATHS.application, { replace: true });
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
      title="신청 상세"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<EventsApplicationDetailSkeleton />}>
        <EventsApplicationDetailContent
          applicationId={applicationId}
          key={applicationId}
        />
      </Suspense>
    </div>
  );
}

export default EventsApplicationDetailScreen;
