import { useState } from "react";

import ScreenToast from "@/components/ui/ScreenToast";
import BililgeReturnConfirmModal from "@/features/bililge/components/BililgeReturnConfirmModal";

// 반납 신청 흐름 — "반납 신청" → 확인 모달(1133:49993) → "신청하기"로 확정하면 완료 토스트(1133:50015).
// "닫기"는 모달만 닫는다.
// 빌릴게 반납 탭과 홈 대여 현황이 같이 쓴다. 실 백엔드 연동 전이라 신청 자체는 토스트만 보여 준다 —
// API가 붙으면 confirm 안에서 요청을 보낸다.
// 모달·토스트는 화면 포털에 그려져서 어디에 두든 화면 위에 뜬다. 쓰는 쪽은 openReturnRequest를 버튼에 걸고
// returnRequestDialogs를 렌더하기만 하면 된다.
export function useBililgeReturnRequest() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  // 토스트가 떠 있는 동안 다시 확인해도 스크린리더가 재안내하도록, 확인마다 값을 바꿔
  // ScreenToast를 새로 마운트한다(EventsApplicationScreen의 실패 토스트와 같은 패턴).
  const [toastToken, setToastToken] = useState(0);

  const confirm = () => {
    setConfirmOpen(false);
    setToastOpen(true);
    setToastToken((token) => token + 1);
  };

  const returnRequestDialogs = (
    <>
      <BililgeReturnConfirmModal
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirm}
        open={confirmOpen}
      />
      <ScreenToast
        key={toastToken}
        message="반납 신청이 완료됐어요."
        onOpenChange={setToastOpen}
        open={toastOpen}
        variant="positive"
      />
    </>
  );

  return {
    openReturnRequest: () => setConfirmOpen(true),
    returnRequestDialogs,
  };
}
