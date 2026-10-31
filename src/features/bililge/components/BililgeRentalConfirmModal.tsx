import { Divider, Typography } from "@wanteddev/wds";
import { useId } from "react";

import ModalButtonGroup from "@/components/ui/ModalButtonGroup";
import ModalShell from "@/components/ui/ModalShell";

interface BililgeRentalConfirmModalProps {
  open: boolean;
  itemName: string;
  quantity: number;
  timeLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma: 빌릴게 대여 확인 모달의 modal(nodeId 1133:49951) — 바깥 틀과 버튼 줄(Modal ButtonGroup
// 1133:49972)은 다른 확인 모달과 같아서 공용 ModalShell·ModalButtonGroup을 쓰고, 본문만 여기서 그린다.
// ConfirmModal과 달리 타이틀이 왼쪽 정렬이고, 설명 문구 대신 물품/수량/대여 시작 시간을 보여주는
// 상세 박스가 있다. 취소 버튼도 "닫기"가 아니라 "수정"이다 — 모달만 닫고 바텀시트로 돌아가 값을
// 바꿀 수 있게 하는 동작이라 onCancel이 시트를 닫지 않는다.
function BililgeRentalConfirmModal({
  open,
  itemName,
  quantity,
  timeLabel,
  onCancel,
  onConfirm,
}: BililgeRentalConfirmModalProps) {
  const titleId = useId();

  return (
    <ModalShell
      className="gap-5 p-5"
      labelledBy={titleId}
      onClose={onCancel}
      open={open}
    >
      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          id={titleId}
          variant="headline1"
          weight="bold"
        >
          이 내용으로 대여를 신청할까요?
        </Typography>
        <div className="flex flex-col gap-3 rounded-xl bg-background-alternative p-4">
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.neutral"
              variant="body2"
              weight="medium"
            >
              물품
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="body2"
              weight="bold"
            >
              {itemName}
            </Typography>
          </div>
          <Divider color="semantic.line.solid.neutral" />
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.neutral"
              variant="body2"
              weight="medium"
            >
              수량
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="body2"
              weight="bold"
            >
              {`${quantity}개`}
            </Typography>
          </div>
          <Divider color="semantic.line.solid.neutral" />
          <div className="flex items-center justify-between">
            <Typography
              color="semantic.label.neutral"
              variant="body2"
              weight="medium"
            >
              대여 시작 시간
            </Typography>
            <Typography
              color="semantic.label.normal"
              variant="body2"
              weight="bold"
            >
              {timeLabel}
            </Typography>
          </div>
        </div>
      </div>
      <ModalButtonGroup
        cancelLabel="수정"
        confirmLabel="신청하기"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </ModalShell>
  );
}

export default BililgeRentalConfirmModal;
