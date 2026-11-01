import { Button } from "@wanteddev/wds";

import { NEGATIVE_BUTTON_SX } from "@/components/ui/negativeButtonSx";

export type ModalTone = "default" | "negative";

interface ModalButtonGroupProps {
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  /** negative면 확인 버튼이 빨강이 된다(되돌릴 수 없는 행동 확인) */
  tone?: ModalTone;
}

// Figma: Modal ButtonGroup (빌릴게 대여 확인 모달 1133:49972 등) — 반반 나란한 취소·확인 버튼.
// 버튼은 WDS `Button`이다: solid×assistive가 Figma의 Fill/Normal 배경 + Label/Neutral 글자,
// solid×primary가 파란 배경 + 흰 글자와 같고, size="medium"이 radius 10px·body2(15px)까지 일치한다.
// 세로 padding만 9px → 12px로 보정한다(Figma 버튼 높이 46px).
function ModalButtonGroup({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  tone = "default",
}: ModalButtonGroupProps) {
  return (
    <div className="flex w-full gap-2">
      <Button
        color="assistive"
        fullWidth
        onClick={onCancel}
        size="medium"
        sx={{ paddingBlock: "12px" }}
        variant="solid"
      >
        {cancelLabel}
      </Button>
      <Button
        color="primary"
        fullWidth
        onClick={onConfirm}
        size="medium"
        sx={{
          ...(tone === "negative" && NEGATIVE_BUTTON_SX.solid),
          paddingBlock: "12px",
        }}
        variant="solid"
      >
        {confirmLabel}
      </Button>
    </div>
  );
}

export default ModalButtonGroup;
