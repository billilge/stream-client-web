import { useState } from "react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenToast from "@/components/ui/ScreenToast";
import { isApiError } from "@/shared/api";
import {
  BILLILGE_ERROR_CODES,
  useApplyBillilgeRentalMutation,
} from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeRentalApplyRequest } from "@/shared/entities/billilge/billilgeTypes";

const RENTAL_TIME_ERROR_CODES: readonly string[] = [
  BILLILGE_ERROR_CODES.timeOutOfRange,
  BILLILGE_ERROR_CODES.timeLunchBreak,
  BILLILGE_ERROR_CODES.timeTooSoon,
];

interface ApplyToast {
  message: string;
  variant: "positive" | "negative";
}

const APPLIED_TOAST: ApplyToast = {
  message: "대여 신청이 완료됐어요.",
  variant: "positive",
};
const FAILED_MESSAGE = "대여 신청에 실패했어요. 다시 시도해 주세요.";

interface UseBillilgeRentalApplyOptions {
  // 대여 바텀시트를 닫는다 — 신청이 끝났거나, 시트에서 값을 고쳐도 소용없는 실패면 닫고 결과를 알린다
  closeSheet: () => void;
  // 서버가 고른 대여 시각을 거절했다(RENTAL_TIME_ERROR_CODES) — 시트가 안내 줄로 알리고 시트는 그대로 둔다
  onTimeRejected: (code: string) => void;
}

// 대여 신청을 보내고 결과를 알린다. 레거시 빌릴게와 같은 흐름이다 — 시각 거절만 시트에 남아 고치게 하고, 나머지는
// 시트를 닫은 뒤 알린다. 회비 미납·이용 제한 기간처럼 미리 막지 않는 실패는 서버 문구를 토스트로 띄우고,
// 같은 물품 중복 신청은 확인 모달에서 "대여할게요"를 누르면 그대로 다시 보낸다.
// 모달·토스트는 화면 포털에 그려져서 시트가 닫혀도 뜬다. 쓰는 쪽은 applyDialogs를 렌더하기만 하면 된다.
export function useBillilgeRentalApply({
  closeSheet,
  onTimeRejected,
}: UseBillilgeRentalApplyOptions) {
  const { mutate, isPending } = useApplyBillilgeRentalMutation();
  // 닫힌 뒤에도 마지막 토스트를 들고 있어서, 닫히는 동안 문구·색이 바뀌지 않는다
  const [toast, setToast] = useState<ApplyToast>(APPLIED_TOAST);
  const [isToastOpen, setIsToastOpen] = useState(false);
  // 토스트가 떠 있는 동안 다시 띄워도 새로 안내되게 ScreenToast의 key로 쓴다
  const [toastKey, setToastKey] = useState(0);
  // 중복 신청으로 거절된 요청 — 확인 모달에서 "대여할게요"를 누르면 이 값 그대로 ignoreDuplicate만 켜서 다시 보낸다
  const [duplicatedRequest, setDuplicatedRequest] =
    useState<BillilgeRentalApplyRequest | null>(null);

  const showToast = (next: ApplyToast) => {
    setToast(next);
    setIsToastOpen(true);
    setToastKey((key) => key + 1);
  };

  // isFromSheet: 시트에서 바로 보낸 요청이면 시트가 열려 있어서 시각 거절을 시트에 맡긴다.
  // 중복 확인 모달에서 다시 보낸 요청은 시트가 닫힌 뒤라 시각 거절도 토스트로 알린다.
  const send = (request: BillilgeRentalApplyRequest, isFromSheet: boolean) => {
    mutate(request, {
      onSuccess: () => {
        closeSheet();
        showToast(APPLIED_TOAST);
      },
      onError: (error) => {
        console.error(error);
        if (
          isFromSheet &&
          isApiError(error) &&
          RENTAL_TIME_ERROR_CODES.includes(error.code)
        ) {
          onTimeRejected(error.code);
          return;
        }
        closeSheet();
        if (
          isApiError(error) &&
          error.code === BILLILGE_ERROR_CODES.duplicated
        ) {
          setDuplicatedRequest(request);
          return;
        }
        // 서버가 거절한 이유(4xx)는 서버 문구를 그대로 보여 준다 — 이용 제한 사유처럼 문구 안에만 있는 정보가 있다
        showToast({
          message:
            isApiError(error) && error.status < 500
              ? error.message
              : FAILED_MESSAGE,
          variant: "negative",
        });
      },
    });
  };

  const confirmDuplicated = () => {
    if (!duplicatedRequest) {
      return;
    }
    setDuplicatedRequest(null);
    send({ ...duplicatedRequest, ignoreDuplicate: true }, false);
  };

  const applyDialogs = (
    <>
      {/* 반납 신청 확인 모달과 같은 공용 Modal(995:34701)에 문구만 바꿨다 — Figma에 이 모달이 없어서 다른 확인 모달처럼
          제목은 물어보는 말, 설명은 이유로 두고 토스 라이팅 규칙(왼쪽 버튼은 "닫기", 버튼으로 다음 행동을 알 수 있게)을 따랐다.
          서버의 "끝나지 않은 신청"에는 아직 받지 않은 신청도 들어가서 "대여 중"이 아니라 "신청한"으로 쓴다. */}
      <ConfirmModal
        cancelLabel="닫기"
        confirmLabel="신청하기"
        description="이미 대여를 신청한 물품이에요."
        onCancel={() => setDuplicatedRequest(null)}
        onConfirm={confirmDuplicated}
        open={duplicatedRequest !== null}
        title="같은 물품을 한 번 더 신청할까요?"
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
    apply: (request: BillilgeRentalApplyRequest) => send(request, true),
    applyDialogs,
    isApplying: isPending,
  };
}
