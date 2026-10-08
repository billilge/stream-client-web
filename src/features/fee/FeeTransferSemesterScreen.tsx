import { ActionAreaButton, TextField } from "@wanteddev/wds";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import { FEE_TRANSFER_PATHS } from "@/features/fee/constants/fee";

// 남은 학기 수로 받을 수 있는 값. 0학기는 납부할 이유가 없고, 상한은 실제 학적 기준이 없어
// 두 자리까지만 받는다 — 서버 검증 규칙이 정해지면 맞춘다.
const SEMESTER_PATTERN = /^[1-9][0-9]?$/;

// Figma: 계좌 송금 - 남은 학기 수 (nodeId 3562:162833)
// 숫자만 받고, 유효한 값이 들어왔을 때만 "다음"이 활성화된다(Figma 기본 상태가 비활성).
function FeeTransferSemesterScreen() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState("");
  const isValid = SEMESTER_PATTERN.test(semester);

  return (
    <FeeTransferStepLayout
      actions={
        <ActionAreaButton
          disabled={!isValid}
          onClick={() =>
            navigate(FEE_TRANSFER_PATHS.transcript, {
              state: { semester: Number(semester) },
            })
          }
          sx={{ paddingBlock: "16px" }}
        >
          다음
        </ActionAreaButton>
      }
      description="남은 학기 수에 따라 납부 금액이 달라져요."
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
        onChange={(event) =>
          setSemester(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))
        }
        placeholder="ex) 3"
        value={semester}
      />
    </FeeTransferStepLayout>
  );
}

export default FeeTransferSemesterScreen;
