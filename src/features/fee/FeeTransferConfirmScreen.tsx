import { ActionAreaButton } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import sendFastMotion from "@/assets/lottie/fee/send-fast.json";
import FeeLottieIcon from "@/features/fee/components/FeeLottieIcon";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { FEE_TRANSFER_PATHS } from "@/features/fee/constants/fee";

// Figma: 계좌 송금 - 토스 다녀와서 확인 버튼 (nodeId 3562:162973)
// 토스에서 송금하고 돌아온 사용자에게 확인을 받는 단계. 실제 입금 확인은 학생회가 수동으로
// 하기 때문에 여기서 "네"를 눌러야 확인 요청이 접수된다.
//
// 종이비행기(3562:162980)는 기울기·크기·위치가 함께 튀어 들어오는(overshoot) Figma Motion이라
// Lottie로 받아 재생한다. 플러그인이 이징을 매 프레임으로 구워서 키프레임만 보면 끝을 알 수
// 없는데, 실제 값은 49프레임(0.82초)부터 고정이다 — rotation 6° → -2.5° → 1° → 0°로 잦아든다.
function FeeTransferConfirmScreen() {
  const navigate = useNavigate();

  return (
    <FeeTransferStepLayout
      actions={
        <>
          <ActionAreaButton
            onClick={() =>
              navigate(FEE_TRANSFER_PATHS.complete, { replace: true })
            }
            sx={{ paddingBlock: "16px" }}
          >
            네, 송금했어요
          </ActionAreaButton>
          {/* 송금을 미루고 빠져나가는 길 — 플로우를 처음부터 다시 타도록 홈으로 보낸다.
              Figma Sub Action은 44px인데 WDS 텍스트 버튼은 28px이라 세로 padding을 보정하고,
              WDS가 따로 주는 세로 margin 8px은 지운다(안 지우면 Figma의 8px 간격이 16px이 된다). */}
          <ActionAreaButton
            onClick={() => navigate("/")}
            sx={{ marginBlock: 0, paddingBlock: "12px" }}
            variant="sub"
          >
            다음에 할게요
          </ActionAreaButton>
        </>
      }
      actionsVariant="strong"
      contentGap={12}
      illustration={
        <FeeLottieIcon animation={sendFastMotion} settledFrame={49} />
      }
      title="송금을 완료하셨나요?"
    />
  );
}

export default FeeTransferConfirmScreen;
