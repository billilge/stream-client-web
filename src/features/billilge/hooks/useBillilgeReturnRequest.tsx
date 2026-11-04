import { useState } from "react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenToast from "@/components/ui/ScreenToast";
import { useReturnBillilgeRentalMutation } from "@/shared/entities/billilge/billilgeQueries";

// 반납 신청 결과 토스트 — 문구와 색을 결과마다 한 번에 고른다
const RETURN_TOASTS = {
  requested: { message: "반납 신청이 완료됐어요.", variant: "positive" },
  failed: {
    message: "반납 신청에 실패했어요. 다시 시도해 주세요.",
    variant: "negative",
  },
} as const;

type ReturnToast = (typeof RETURN_TOASTS)[keyof typeof RETURN_TOASTS];

// 반납 신청 흐름 — "반납 신청" → 확인 모달(1133:49993) → "신청하기"로 확정하면 서버에 반납을 신청하고
// 결과 토스트(완료 1133:50015)를 띄운다. 확인 모달은 Figma에서 공용 Modal 인스턴스(1133:50014)라
// ConfirmModal을 그대로 쓴다. "닫기"는 모달만 닫는다.
// 빌릴게 반납 탭과 홈 대여 현황이 같이 쓴다.
// 모달·토스트는 화면 포털에 그려져서 어디에 두든 화면 위에 뜬다. 쓰는 쪽은 openReturnRequest를 버튼에 걸고
// returnRequestDialogs를 렌더하기만 하면 된다.
export function useBillilgeReturnRequest() {
  const { mutate } = useReturnBillilgeRentalMutation();
  // 확인 모달을 띄운 대여 — null이면 모달이 닫혀 있다
  const [rentalHistoryId, setRentalHistoryId] = useState<number | null>(null);
  // 닫힌 뒤에도 마지막 토스트를 들고 있어서, 닫히는 동안 문구·색이 바뀌지 않는다
  const [toast, setToast] = useState<ReturnToast>(RETURN_TOASTS.requested);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // 토스트가 떠 있는 동안 다시 띄워도 스크린리더가 재안내하도록 ScreenToast의 key로 쓴다
  // (EventsApplicationScreen의 실패 토스트와 같은 패턴)
  const [toastKey, setToastKey] = useState(0);

  const showToast = (next: ReturnToast) => {
    setToast(next);
    setIsToastOpen(true);
    setToastKey((key) => key + 1);
  };

  // 모달은 바로 닫고, 다시 받은 반납 필요 대여가 들어온 뒤에 결과 토스트를 띄운다
  const confirm = () => {
    if (rentalHistoryId === null) {
      return;
    }
    setRentalHistoryId(null);
    mutate(rentalHistoryId, {
      onSuccess: () => showToast(RETURN_TOASTS.requested),
      onError: (error) => {
        console.error(error);
        showToast(RETURN_TOASTS.failed);
      },
    });
  };

  const returnRequestDialogs = (
    <>
      <ConfirmModal
        cancelLabel="닫기"
        confirmLabel="신청하기"
        description="승인 알림을 받은 후 학생회실에 반납해 주세요."
        onCancel={() => setRentalHistoryId(null)}
        onConfirm={confirm}
        open={rentalHistoryId !== null}
        title="반납을 신청할까요?"
      />
      <ScreenToast
        key={toastKey}
        message={toast.message}
        onOpenChange={setIsToastOpen}
        open={isToastOpen}
        variant={toast.variant}
      />
    </>
  );

  return {
    openReturnRequest: (id: number) => setRentalHistoryId(id),
    returnRequestDialogs,
  };
}
