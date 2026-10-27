import { ActionAreaButton } from "@wanteddev/wds";
import { useState } from "react";

import wonMotion from "@/assets/lottie/fee/won.json";
import FeeLottieIcon from "@/features/fee/components/FeeLottieIcon";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { FEE_EXTERNAL_LINKS } from "@/features/fee/constants/fee";

// Figma: 계좌 송금 - 토스로 이동 안내 (nodeId 3562:163025) / 토스 이동 실패 (3562:163046)
//
// 두 프레임은 같은 단계의 상태 차이다 — 실패하면 일러스트가 빠지고 문구와 버튼 라벨만 바뀐다.
// 그래서 퍼널 단계를 나누지 않고 실패 여부 state로 토글한다.
//
// 토스는 딥링크라 열렸는지 브라우저가 알려주지 않는다. 그래서 실패 화면은 "링크 주소가 아직
// 없을 때"만 띄운다 — 주소가 채워지면 열고 바로 송금 확인 단계로 넘어간다. 앱 WebView에서
// 열기가 막히는 경우까지 가려내려면 네이티브 브리지로 결과를 받아야 한다(#107 리뷰).
//
// ₩ 아이콘(3562:163032)은 획이 그려지는 Figma Motion이라 Lottie로 받아 재생한다. 2초
// 타임라인이지만 실제 움직임은 66프레임(1.1초)에 끝나고 나머지는 멈춰 있는 구간이다 —
// json의 키프레임이 실제로 66에서 끝나는 걸 확인했다.
function FeeTransferTossStep({
  onBack,
  onTransferred,
}: {
  onBack: () => void;
  /** 토스를 연 뒤 — 다녀와서 확인을 받을 송금 확인 단계로 넘긴다 */
  onTransferred: () => void;
}) {
  const [hasFailed, setFailed] = useState(false);

  const handleOpenToss = () => {
    if (!FEE_EXTERNAL_LINKS.tossTransfer) {
      setFailed(true);
      return;
    }
    // 반환값으로 열렸는지 판정하지 않는다 — `noopener`를 주면 window.open은 스펙상 항상
    // null을 돌려줘서, 토스가 실제로 열려도 실패로 보게 된다. 딥링크는 애초에 브라우저가
    // 열림 여부를 알려주지도 않는다. 그래서 열기만 하고 송금 확인 단계로 넘긴다 —
    // 송금하지 못했으면 그 단계의 "다음에 할게요"로 빠져나갈 수 있다.
    window.open(FEE_EXTERNAL_LINKS.tossTransfer, "_blank", "noopener");
    onTransferred();
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
        onBack={onBack}
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
      illustration={<FeeLottieIcon animation={wonMotion} settledFrame={66} />}
      onBack={onBack}
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

export default FeeTransferTossStep;
