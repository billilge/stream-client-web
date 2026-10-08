import { ActionAreaButton } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import wonIcon from "@/assets/icons/fee/won.svg";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import {
  FEE_EXTERNAL_LINKS,
  FEE_TRANSFER_PATHS,
} from "@/features/fee/constants/fee";

// Figma: 계좌 송금 - 토스로 이동 안내 (nodeId 3562:163025) / 토스 이동 실패 (3562:163046)
//
// 두 프레임은 같은 화면의 상태 차이다 — 실패하면 일러스트가 빠지고 문구와 버튼 라벨만 바뀐다.
// 그래서 라우트를 나누지 않고 실패 여부 state로 토글한다.
//
// 토스는 딥링크라 열렸는지 브라우저가 알려주지 않는다. 링크 주소 자체가 아직 없어서 지금은
// 상수가 비어 있으면 곧바로 실패 상태로 두고, 주소가 생기면 window.open 결과로 판정한다.
function FeeTransferTossScreen() {
  const navigate = useNavigate();
  const [hasFailed, setFailed] = useState(false);

  const handleOpenToss = () => {
    if (!FEE_EXTERNAL_LINKS.tossTransfer) {
      setFailed(true);
      return;
    }
    const opened = window.open(
      FEE_EXTERNAL_LINKS.tossTransfer,
      "_blank",
      "noopener",
    );
    if (opened) {
      // 토스에 다녀오면 돌아올 화면이 송금 확인 단계다
      navigate(FEE_TRANSFER_PATHS.confirm);
      return;
    }
    setFailed(true);
  };

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
