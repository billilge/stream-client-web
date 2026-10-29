import { startTransition, useState } from "react";

import { cancelMyEventApplication } from "@/entities/events/eventsApi";

// 취소 결과 토스트 — 문구와 색을 결과마다 한 번에 고른다
const CANCEL_TOASTS = {
  cancelled: { message: "신청이 취소됐어요.", variant: "positive" },
  failed: {
    message: "신청 취소에 실패했어요. 다시 시도해 주세요.",
    variant: "negative",
  },
} as const;

type CancelToast = (typeof CANCEL_TOASTS)[keyof typeof CANCEL_TOASTS];

// 신청내역을 취소하고 결과 토스트를 정한다. 화면은 확인 모달·토스트를 그리는 일만 맡는다.
export function useEventsApplicationCancel(applicationId: string) {
  const [isCancelling, setIsCancelling] = useState(false);
  // 닫힌 뒤에도 마지막 토스트를 들고 있어서, 닫히는 동안 문구·색이 바뀌지 않는다
  const [toast, setToast] = useState<CancelToast>(CANCEL_TOASTS.cancelled);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // 토스트가 떠 있는 동안 다시 띄워도 새로 안내되게 ScreenToast의 key로 쓴다
  const [toastKey, setToastKey] = useState(0);

  const showToast = (next: CancelToast) => {
    setToast(next);
    setIsToastOpen(true);
    setToastKey((key) => key + 1);
  };

  const cancel = async () => {
    setIsCancelling(true);
    try {
      await cancelMyEventApplication(applicationId);
      // 취소 API가 조회 캐시를 지워서, 다시 그리면 상세가 취소된 신청내역을 새로 받는다.
      // 그 동안 스켈레톤 대신 지금 화면을 유지하도록 다시 그리는 업데이트를 전부 transition으로 묶는다
      // (토스트는 취소된 화면과 함께 뜬다).
      startTransition(() => {
        setIsCancelling(false);
        showToast(CANCEL_TOASTS.cancelled);
      });
    } catch (error) {
      console.error(error);
      setIsCancelling(false);
      showToast(CANCEL_TOASTS.failed);
    }
  };

  const closeToast = () => setIsToastOpen(false);

  return { cancel, closeToast, isCancelling, isToastOpen, toast, toastKey };
}
