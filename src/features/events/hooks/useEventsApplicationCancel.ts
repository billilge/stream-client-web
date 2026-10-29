import { useState } from "react";

import { useCancelEventApplicationMutation } from "@/entities/events/eventsApi";

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
  const { mutate, isPending } = useCancelEventApplicationMutation();
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

  // 무효화된 상세는 데이터가 이미 있어서 다시 받는 동안 서스펜드되지 않고 지금 화면을 유지한다
  const cancel = () => {
    mutate(applicationId, {
      onSuccess: () => showToast(CANCEL_TOASTS.cancelled),
      onError: (error) => {
        console.error(error);
        showToast(CANCEL_TOASTS.failed);
      },
    });
  };

  const closeToast = () => setIsToastOpen(false);

  return {
    cancel,
    closeToast,
    isCancelling: isPending,
    isToastOpen,
    toast,
    toastKey,
  };
}
