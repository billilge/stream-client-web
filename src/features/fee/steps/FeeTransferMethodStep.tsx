import { ActionAreaButton, RadioGroup } from "@wanteddev/wds";
import { useState } from "react";

import FeeTransferMethodOption from "@/features/fee/components/FeeTransferMethodOption";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { formatWon } from "@/features/fee/constants/fee";
import type { FeeTransferMethod } from "@/features/fee/constants/feeTransferFunnel";

// 송금 방법 고르기 — 토스를 쓰지 않는 학생도 낼 수 있게 토스 이동 안내(Figma 3562:163025)를 대신한다.
// Figma에 없는 화면이라 WDS `RadioGroup` 선택 카드 두 개로 그렸다. 고른 방법에 따라 메인 버튼만 바뀐다.
// - 토스로 송금: 금액이 채워진 토스 송금 화면을 연다
// - 계좌이체: 학생회 계좌번호를 복사한다. 계좌번호는 화면에 보여 주지 않고 토스트로만 알린다
// 어느 쪽이든 누르면 퍼널이 송금 확인 단계로 넘긴다 — 송금하고 돌아오면 그 화면이 기다린다.
// 실제로 여는·복사하는 일은 퍼널(FeeTransferScreen)이 맡는다.
//
// 고른 방법은 퍼널이 들고 있어서(`method`) 송금 확인에서 뒤로 돌아와도 남는다.
//
// 토스 이동 실패(Figma 3562:163046)는 이 단계 안의 state다 — 서버가 송금 링크를 주지 않았을 때(`hasTossLink`)
// 토스를 고르면 띄운다. 토스는 딥링크라 실제로 열렸는지 브라우저가 알려주지 않아서 링크가 있으면 열기만 한다.
// 실패 화면의 뒤로가기는 방법 고르기로 돌아와 계좌이체를 고를 수 있게 한다.
function FeeTransferMethodStep({
  method,
  remainingSemesters,
  transferAmount,
  hasTossLink,
  onBack,
  onChangeMethod,
  onOpenToss,
  onCopyAccount,
}: {
  method: FeeTransferMethod;
  remainingSemesters: number;
  /** 보낼 금액(남은 학기 수 × 한 학기 금액) — 한 학기 금액은 학기 수로 나눠 안내한다 */
  transferAmount: number;
  /** 토스 송금 링크가 준비됐는지 — 없으면 토스를 골랐을 때 이동 실패 화면으로 바꾼다 */
  hasTossLink: boolean;
  onBack: () => void;
  onChangeMethod: (method: FeeTransferMethod) => void;
  /** 토스를 열고 송금 확인 단계로 넘긴다 */
  onOpenToss: () => void;
  /** 계좌번호를 복사해 토스트로 알리고 송금 확인 단계로 넘긴다 */
  onCopyAccount: () => void;
}) {
  const [hasTossFailed, setTossFailed] = useState(false);

  const handleOpenToss = () => {
    if (!hasTossLink) {
      setTossFailed(true);
      return;
    }
    onOpenToss();
  };

  if (hasTossFailed) {
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
        onBack={() => setTossFailed(false)}
        title="토스를 열지 못했어요"
      />
    );
  }

  const amountPerSemester = transferAmount / remainingSemesters;

  return (
    <FeeTransferStepLayout
      actions={
        method === "toss" ? (
          <ActionAreaButton
            onClick={handleOpenToss}
            sx={{ paddingBlock: "16px" }}
          >
            토스로 이동하기
          </ActionAreaButton>
        ) : (
          <ActionAreaButton
            onClick={onCopyAccount}
            sx={{ paddingBlock: "16px" }}
          >
            계좌번호 복사하기
          </ActionAreaButton>
        )
      }
      description={`학생회비는 한 학기에 ${formatWon(amountPerSemester)}이에요.\n남은 ${remainingSemesters}학기만큼 ${formatWon(transferAmount)}을 보내 주세요.`}
      onBack={onBack}
      title="어떻게 송금할까요?"
    >
      <RadioGroup
        aria-label="송금 방법"
        onValueChange={(value) => onChangeMethod(value as FeeTransferMethod)}
        value={method}
      >
        {/* RadioGroup 자체 레이아웃에 기대지 않고 카드 간격(12px)을 여기서 준다 */}
        <div className="flex flex-col gap-3">
          <FeeTransferMethodOption
            caption="금액이 채워진 토스 송금 화면을 열어요"
            selected={method === "toss"}
            title="토스로 송금"
            value="toss"
          />
          <FeeTransferMethodOption
            caption="계좌번호를 복사해서 은행 앱에서 보내요"
            selected={method === "account"}
            title="계좌이체"
            value="account"
          />
        </div>
      </RadioGroup>
    </FeeTransferStepLayout>
  );
}

export default FeeTransferMethodStep;
