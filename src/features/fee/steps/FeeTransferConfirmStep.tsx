import { ActionAreaButton } from "@wanteddev/wds";
import { useState } from "react";

import sendFastMotion from "@/assets/lottie/fee/send-fast.json";
import FeeLottieIcon from "@/features/fee/components/FeeLottieIcon";
import FeeTransferPostponeModal from "@/features/fee/components/FeeTransferPostponeModal";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";

const CONFIRM_LABEL = "네, 송금했어요";

// Figma: 계좌 송금 - 토스 다녀와서 확인 버튼 (nodeId 3562:162973)
// 송금하고 돌아온 사용자에게 확인을 받는 단계(토스는 송금 방법에서, 계좌이체는 송금 후 복귀 안내에서 온다).
// 실제 입금 확인은 학생회가 수동으로 하기 때문에 여기서 "네"를 눌러야 확인 요청이 접수된다.
// 아이콘과 제목 사이는 8px이다(수정 5364:3200에서 12 → 8px).
//
// "다음에 할게요"는 바로 빠져나가지 않고 확인 모달(5365:88888)을 띄운다 — 잘못 눌러 이탈하지 않게 한다.
//
// 종이비행기(3562:162980)는 기울기·크기·위치가 함께 튀어 들어오는(overshoot) Figma Motion이라
// Lottie로 받아 재생한다. 플러그인이 이징을 매 프레임으로 구워서 키프레임만 보면 끝을 알 수
// 없는데, 실제 값은 49프레임(0.82초)부터 고정이다 — rotation 6° → -2.5° → 1° → 0°로 잦아든다.
function FeeTransferConfirmStep({
  isSubmitting,
  onBack,
  onConfirm,
  onPostpone,
}: {
  /** 납부 요청을 보내는 중인지 — 그동안 두 버튼을 모두 막는다 */
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
  /** 송금을 미루고 플로우를 빠져나간다(확인 모달에서 "다음에 하기"를 눌렀을 때) */
  onPostpone: () => void;
}) {
  const [isPostponeModalOpen, setPostponeModalOpen] = useState(false);

  return (
    <>
      <FeeTransferStepLayout
        actions={
          <>
            <ActionAreaButton
              loading={isSubmitting}
              onClick={onConfirm}
              sx={{ paddingBlock: "16px" }}
            >
              {CONFIRM_LABEL}
            </ActionAreaButton>
            {/* 송금을 미루고 빠져나가는 길 — 플로우를 처음부터 다시 타도록 홈으로 보낸다.
                Figma Sub Action은 44px인데 WDS 텍스트 버튼은 28px이라 세로 padding을 보정하고,
                WDS가 따로 주는 세로 margin 8px은 지운다(안 지우면 Figma의 8px 간격이 16px이 된다). */}
            <ActionAreaButton
              disabled={isSubmitting}
              onClick={() => setPostponeModalOpen(true)}
              sx={{ marginBlock: 0, paddingBlock: "12px" }}
              variant="sub"
            >
              다음에 할게요
            </ActionAreaButton>
          </>
        }
        actionsVariant="strong"
        contentGap={8}
        illustration={
          <FeeLottieIcon animation={sendFastMotion} settledFrame={49} />
        }
        onBack={onBack}
        title="송금을 완료하셨나요?"
      />

      <FeeTransferPostponeModal
        continueButtonLabel={CONFIRM_LABEL}
        onClose={() => setPostponeModalOpen(false)}
        onPostpone={onPostpone}
        open={isPostponeModalOpen}
      />
    </>
  );
}

export default FeeTransferConfirmStep;
