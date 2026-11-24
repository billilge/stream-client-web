import ConfirmModal from "@/components/ui/ConfirmModal";

interface FeeTransferPostponeModalProps {
  open: boolean;
  /** 화면의 메인 버튼 이름 — 송금했다면 그 버튼을 누르라고 안내한다 */
  continueButtonLabel: string;
  /** 계속 진행하기 — 모달만 닫는다 */
  onClose: () => void;
  /** 다음에 하기 — 송금을 미루고 플로우를 빠져나간다 */
  onPostpone: () => void;
}

// Figma: '다음에 할게요' 확인 모달 (nodeId 5365:88888, 공용 Modal 995:34701)
// 송금 확인·송금 후 복귀 안내 화면의 "다음에 할게요"를 잘못 눌러 플로우를 빠져나가지 않게 한 번 묻는다.
// 설명의 버튼 이름은 그 화면의 메인 버튼에 맞춘다 — 송금 확인은 [네, 송금했어요], 복귀 안내는 [송금 완료하고 계속하기].
function FeeTransferPostponeModal({
  open,
  continueButtonLabel,
  onClose,
  onPostpone,
}: FeeTransferPostponeModalProps) {
  return (
    <ConfirmModal
      cancelLabel="계속 진행하기"
      confirmLabel="다음에 하기"
      description={`송금했다면 계속 진행해서\n[${continueButtonLabel}] 버튼을 눌러 주세요.`}
      onCancel={onClose}
      onConfirm={() => {
        onClose();
        onPostpone();
      }}
      open={open}
      title="송금 확인을 다음에 할까요?"
    />
  );
}

export default FeeTransferPostponeModal;
