import { ActionAreaButton } from "@wanteddev/wds";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import wonIcon from "@/assets/icons/fee/won.svg";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import {
  buildTossTransferUrl,
  FEE_MOCK_AMOUNT,
  FEE_TRANSFER_PATHS,
} from "@/features/fee/constants/fee";
import { useTossDeepLink } from "@/features/fee/hooks/useTossDeepLink";

// Figma: 계좌 송금 - 토스로 이동 안내 (nodeId 3562:163025) / 토스 이동 실패 (3562:163046)
//
// 두 프레임은 같은 화면의 상태 차이다 — 실패하면 일러스트가 빠지고 문구와 버튼 라벨만 바뀐다.
// 그래서 라우트를 나누지 않고 실패 여부 state로 토글한다.
//
// Figma 문구("송금 후 이 화면으로 돌아와 송금 완료 여부를 꼭 확인해 주세요")대로, 토스에 갔다가
// 브라우저로 돌아오면 송금 확인 단계로 넘긴다. 복귀 감지는 useTossDeepLink이 한다.
function FeeTransferTossScreen() {
  const navigate = useNavigate();
  const [hasFailed, setFailed] = useState(false);
  const handleFail = useCallback(() => setFailed(true), []);
  const handleReturn = useCallback(
    () => navigate(FEE_TRANSFER_PATHS.confirm),
    [navigate],
  );
  const { open } = useTossDeepLink({
    onFail: handleFail,
    onReturn: handleReturn,
  });

  // 금액은 남은 학기 수에 따라 달라져야 하는데 규칙을 아직 못 받아서 목업 값으로 보낸다
  const handleOpenToss = () => open(buildTossTransferUrl(FEE_MOCK_AMOUNT));

  if (hasFailed) {
    return (
      <FeeTransferStepLayout
        actions={
          <ActionAreaButton
            onClick={handleOpenToss}
            sx={{ paddingBlock: "16px" }}
          >
            토스로 다시 이동하기
          </ActionAreaButton>
        }
        contentGap={8}
        description={
          "잠시 후 다시 시도해 주세요.\n계속 열리지 않으면 토스 앱을 확인해 주세요."
        }
        title="토스를 열지 못했어요"
      />
    );
  }

  return (
    <FeeTransferStepLayout
      actions={
        <ActionAreaButton
          onClick={handleOpenToss}
          sx={{ paddingBlock: "16px" }}
        >
          토스로 이동하기
        </ActionAreaButton>
      }
      contentGap={8}
      description={
        "송금 후 이 화면으로 돌아와\n송금 완료 여부를 꼭 확인해 주세요."
      }
      illustration={<img alt="" className="size-12" src={wonIcon} />}
      title={
        <>
          이제 토스에서 학생회비를
          <br />
          송금해 주세요
        </>
      }
    />
  );
}

export default FeeTransferTossScreen;
