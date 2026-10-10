import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense, startTransition, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import { cancelMyEventApplication } from "@/entities/events/eventsApi";
import EventsApplicationDetailContent from "@/features/events/components/EventsApplicationDetailContent";
import EventsApplicationDetailSkeleton from "@/features/events/components/EventsApplicationDetailSkeleton";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";

type CancelToast = "cancelled" | "failed";

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 확인모달 (1133:46131), 신청취소 상세 + 토스트 (1133:46216)
function EventsApplicationDetailScreen() {
  const { applicationId = "" } = useParams();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [toast, setToast] = useState<CancelToast | null>(null);
  // 토스트가 떠 있는 동안 다시 띄워도 새로 안내되게 ScreenToast의 key로 쓴다
  const [toastCount, setToastCount] = useState(0);

  const showToast = (next: CancelToast) => {
    setToast(next);
    setToastCount((count) => count + 1);
  };

  const cancelApplication = async () => {
    setIsConfirmOpen(false);
    setIsCancelling(true);
    try {
      await cancelMyEventApplication(applicationId);
      // 취소 API가 조회 캐시를 지워서, 다시 그리면 상세가 취소된 신청내역을 새로 받는다.
      // 그 동안 스켈레톤 대신 지금 화면을 유지하도록 다시 그리는 업데이트를 전부 transition으로 묶는다
      // (토스트는 취소된 화면과 함께 뜬다).
      startTransition(() => {
        setIsCancelling(false);
        showToast("cancelled");
      });
    } catch (error) {
      console.error(error);
      setIsCancelling(false);
      showToast("failed");
    }
  };

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
        onConfirm={cancelApplication}
        open={isConfirmOpen}
        title="신청을 취소할까요?"
        tone="negative"
      />

      <ScreenToast
        key={toastCount}
        message={
          toast === "failed"
            ? "신청 취소에 실패했어요. 다시 시도해 주세요."
            : "신청이 취소됐어요."
        }
        onOpenChange={(open) => {
          if (!open) {
            setToast(null);
          }
        }}
        open={toast !== null}
        variant={toast === "failed" ? "negative" : "positive"}
      />
    </div>
  );
}

export default EventsApplicationDetailScreen;
