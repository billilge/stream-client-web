import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsApplicationDetailContent from "@/features/events/components/EventsApplicationDetailContent";
import EventsApplicationDetailSkeleton from "@/features/events/components/EventsApplicationDetailSkeleton";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import { useEventsApplicationCancel } from "@/features/events/hooks/useEventsApplicationCancel";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 확인모달 (1133:46131), 신청취소 상세 + 토스트 (1133:46216)
function EventsApplicationDetailScreen() {
  const { applicationId = "" } = useParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { cancel, closeToast, isCancelling, isToastOpen, toast, toastKey } =
    useEventsApplicationCancel(applicationId);

  // 바로 들어와 뒤로 갈 히스토리가 없으면 신청내역 목록으로 보낸다
  const goBack = useBackNavigation(EVENTS_TAB_PATHS.application);

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
          fallbackPath={EVENTS_TAB_PATHS.application}
          isCancelling={isCancelling}
          key={applicationId}
          onCancel={() => setIsConfirmOpen(true)}
        />
      </Suspense>

      <ConfirmModal
        cancelLabel="닫기"
        confirmLabel="신청 취소"
        description="모집 중일 때는 다시 신청할 수 있어요."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          cancel();
        }}
        open={isConfirmOpen}
        title="신청을 취소할까요?"
        tone="negative"
      />

      <ScreenToast
        key={toastKey}
        message={toast.message}
        onOpenChange={(open) => {
          if (!open) {
            closeToast();
          }
        }}
        open={isToastOpen}
        variant={toast.variant}
      />
    </div>
  );
}

export default EventsApplicationDetailScreen;
