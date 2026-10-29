import { ActionAreaButton, TextField } from "@wanteddev/wds";
import { useState } from "react";

import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { SEMESTER_PATTERN } from "@/features/fee/constants/feeTransferFunnel";

// Figma: 계좌 송금 - 남은 학기 수 (nodeId 3562:162833)
// 숫자만 받고, 유효한 값이 들어왔을 때만 "다음"이 활성화된다(Figma 기본 상태가 비활성).
function FeeTransferSemesterStep({
  initialSemester,
  onBack,
  onChangeSemester,
  onNext,
}: {
  initialSemester: number | undefined;
  onBack: () => void;
  /** 입력할 때마다 퍼널 context에 반영한다 — 캡처 단계에서 뒤로 돌아와도 학기 수가 남는다 */
  onChangeSemester: (semester: number | undefined) => void;
  onNext: (semester: number) => void;
}) {
  const [digits, setDigits] = useState(() =>
    initialSemester === undefined ? "" : String(initialSemester),
  );
  const isValid = SEMESTER_PATTERN.test(digits);

  return (
    <FeeTransferStepLayout
      actions={
        <ActionAreaButton
          disabled={!isValid}
          onClick={() => onNext(Number(digits))}
          sx={{ paddingBlock: "16px" }}
        >
          다음
        </ActionAreaButton>
      }
      description="남은 학기 수에 따라 납부 금액이 달라져요."
      onBack={onBack}
      title={
        <>
          현재 남은 학기 수를
          <br />
          알려 주세요
        </>
      }
    >
      <TextField
        // 숫자 키패드를 띄우되 type="number"의 스피너·휠 스크롤은 피한다
        inputMode="numeric"
        onChange={(event) => {
          const nextDigits = event.target.value
            .replace(/[^0-9]/g, "")
            .slice(0, 2);
          setDigits(nextDigits);
          onChangeSemester(
            SEMESTER_PATTERN.test(nextDigits) ? Number(nextDigits) : undefined,
          );
        }}
        placeholder="ex) 3"
        value={digits}
      />
    </FeeTransferStepLayout>
  );
}

export default FeeTransferSemesterStep;
