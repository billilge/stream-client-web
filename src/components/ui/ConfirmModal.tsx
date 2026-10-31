import { Typography } from "@wanteddev/wds";
import { IconCircleExclamationFill } from "@wanteddev/wds-icon";
import { useId } from "react";

import ModalButtonGroup, {
  type ModalTone,
} from "@/components/ui/ModalButtonGroup";
import ModalShell from "@/components/ui/ModalShell";

interface ConfirmModalProps {
  open: boolean;
  /** 제목 앞에 붙는 강조 부분(파란색). 예: 행사명 */
  highlight?: string;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  /**
   * negative: 되돌릴 수 없는 행동을 확인할 때(Figma Modal의 `Circle Exclamation=on` + `Style=Negative`).
   * 느낌표 아이콘이 붙고 확인 버튼이 빨강이 된다.
   */
  tone?: ModalTone;
}

// Figma: Modal (nodeId 995:34701 — 신청 확인 모달 1133:43407에서 사용). Stream 로컬 컴포넌트다.
// 가운데 정렬 제목+설명에 취소·확인 버튼 두 개인 모달. 바깥 틀(포털·딤·포커스·Esc)은 ModalShell,
// 버튼 줄은 ModalButtonGroup이 맡는다.
function ConfirmModal({
  open,
  highlight,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  tone = "default",
}: ConfirmModalProps) {
  const isNegative = tone === "negative";
  const titleId = useId();

  return (
    <ModalShell
      className={`items-center gap-6 ${
        // 아이콘이 붙는 경우 Figma 여백이 위 24px이 아니라 사방 20px이다
        isNegative ? "p-5" : "px-5 pt-6 pb-5"
      }`}
      labelledBy={titleId}
      onClose={onCancel}
      open={open}
    >
      {/* 아이콘과 문구 사이는 12px — 카드 자체 간격(24px)과 달라서 한 번 더 감싼다 */}
      <div
        className={`flex w-full flex-col items-center ${isNegative ? "gap-3" : ""}`}
      >
        {isNegative && (
          <IconCircleExclamationFill className="size-[63px] text-fill-strong" />
        )}
        {/* opacity-80은 Figma Message 프레임에 걸려 있는 값을 그대로 옮긴 것이다 */}
        <div className="flex w-full flex-col gap-1 text-center opacity-80">
          <Typography
            as="p"
            color="semantic.label.normal"
            id={titleId}
            variant="heading2"
            weight="bold"
          >
            {/* 강조 부분만 파란색 — 색을 섞는 규칙을 화면이 아니라 여기서 갖는다 */}
            {highlight && (
              <Typography
                as="span"
                color="semantic.primary.normal"
                variant="heading2"
                weight="bold"
              >
                {highlight}{" "}
              </Typography>
            )}
            {title}
          </Typography>
          {description && (
            // Figma 모달 설명은 줄바꿈 위치까지 디자인에 포함돼 있어서(예: 탈퇴 확인
            // 3524:152535, K스마트멘토 이동 확인 3562:162972) `\n`을 그대로 살린다.
            // 기존 사용처는 모두 한 줄 문구라 영향이 없다.
            <Typography
              as="p"
              className="whitespace-pre-line"
              color="semantic.label.alternative"
              variant="label1-reading"
              weight="regular"
            >
              {description}
            </Typography>
          )}
        </div>
      </div>
      <ModalButtonGroup
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        onCancel={onCancel}
        onConfirm={onConfirm}
        tone={tone}
      />
    </ModalShell>
  );
}

export default ConfirmModal;
