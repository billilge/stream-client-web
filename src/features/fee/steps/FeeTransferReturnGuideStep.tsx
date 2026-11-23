import { ActionAreaButton } from "@wanteddev/wds";
import { useState } from "react";

import sendFastMotion from "@/assets/lottie/fee/send-fast.json";
import FeeLottieIcon from "@/features/fee/components/FeeLottieIcon";
import FeeTransferPostponeModal from "@/features/fee/components/FeeTransferPostponeModal";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";

const CONTINUE_LABEL = "송금 완료하고 계속하기";

// Figma: 송금 후 복귀 안내 (nodeId 5365:88979, 수정 항목 5364:3200)
// 계좌이체를 골라 계좌번호를 복사하면 송금 확인("송금을 완료하셨나요?") 대신 이 안내를 먼저 보여 준다 —
// 복사하자마자 완료했는지 묻는 흐름이 어색해서다. 은행 앱에서 송금하고 돌아와 "송금 완료하고 계속하기"를 누르면
// 송금 확인 단계로 넘어가 거기서 한 번 더 확인한다(토스는 앱이 금액까지 채워 열려서 이 안내 없이 바로 송금 확인으로 간다).
// 아이콘·제목·설명 사이는 모두 8px이고, 종이비행기는 송금 확인과 같은 Lottie다.
//
// "다음에 할게요"는 송금 확인과 같이 확인 모달(5365:88888)을 띄운다 — 설명의 버튼 이름만 이 화면에 맞춘다.
function FeeTransferReturnGuideStep({
  onBack,
  onContinue,
  onPostpone,
}: {
  onBack: () => void;
  /** 송금하고 돌아왔다 — 송금 확인 단계로 넘긴다 */
  onContinue: () => void;
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
              onClick={onContinue}
              sx={{ paddingBlock: "16px" }}
            >
              {CONTINUE_LABEL}
            </ActionAreaButton>
            {/* 송금 확인과 같은 Sub Action 보정(세로 44px, WDS 세로 margin 제거) */}
            <ActionAreaButton
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
        description={
          "은행 앱에서 송금한 뒤,\n이곳으로 돌아와 다음 단계를 진행해 주세요."
        }
        illustration={
          <FeeLottieIcon animation={sendFastMotion} settledFrame={49} />
        }
        onBack={onBack}
        title={
          <>
            송금 후 이 화면으로
            <br />
            돌아와 주세요
          </>
        }
      />

      <FeeTransferPostponeModal
        continueButtonLabel={CONTINUE_LABEL}
        onClose={() => setPostponeModalOpen(false)}
        onPostpone={onPostpone}
        open={isPostponeModalOpen}
      />
    </>
  );
}

export default FeeTransferReturnGuideStep;
