import { ActionAreaButton } from "@wanteddev/wds";
import { useNavigate } from "react-router-dom";

import sendFastIcon from "@/assets/icons/fee/send-fast.svg";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { FEE_TRANSFER_PATHS } from "@/features/fee/constants/fee";

// Figma: 계좌 송금 - 토스 다녀와서 확인 버튼 (nodeId 3562:162973)
// 토스에서 송금하고 돌아온 사용자에게 확인을 받는 단계. 실제 입금 확인은 학생회가 수동으로
// 하기 때문에 여기서 "네"를 눌러야 확인 요청이 접수된다.
//
// 일러스트에 Figma Motion(종이비행기가 튀어 들어오는 2초 루프)이 붙어 있지만, Lottie는
// Dev mode에서 뽑을 수 없고 LottieFiles 플러그인으로 디자이너가 내보내야 한다
// (component-convention.md "모션 (Lottie)"). 받기 전까지는 정지 SVG로 둔다 —
// 키프레임을 손으로 옮기지 않는다.
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
      illustration={<img alt="" className="size-12" src={sendFastIcon} />}
      title="송금을 완료하셨나요?"
    />
  );
}

export default FeeTransferConfirmScreen;
