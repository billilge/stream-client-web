import { ActionAreaButton, Typography } from "@wanteddev/wds";
import { useEffect, useState } from "react";

import ConfirmModal from "@/components/ui/ConfirmModal";
import FeeImagePreviewOverlay from "@/features/fee/components/FeeImagePreviewOverlay";
import FeeImageUploadButton from "@/features/fee/components/FeeImageUploadButton";
import FeeTranscriptGuide from "@/features/fee/components/FeeTranscriptGuide";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import FeeUploadedFileCard from "@/features/fee/components/FeeUploadedFileCard";

// Figma: 계좌 송금 - 이미지 업로드하기 전 (nodeId 3562:162845) / 업로드 후 (3562:162891) /
// K-스마트멘토 이동 확인 모달 (3562:162940) / 업로드한 이미지 미리보기 (3595:70574)
//
// 네 프레임이 한 단계의 상태 변화라 퍼널 단계를 나누지 않고 업로드 여부·모달 열림으로 토글한다.
// 업로드 API가 아직 없어서 고른 파일을 퍼널 context에 담아 두기만 한다 — 미리보기는 objectURL로
// 띄우고, 연동할 때 이 자리에서 업로드 요청을 보내면 된다.
// K-스마트멘토를 여는 일은 퍼널(FeeTransferScreen)이 맡고 여기는 `onOpenGuide`만 부른다.
function FeeTransferTranscriptStep({
  transcript,
  onBack,
  onChangeTranscript,
  onNext,
  onOpenGuide,
}: {
  /** 고른 캡처 — 퍼널 context가 들고 있는 값이 유일한 출처다 */
  transcript: File | undefined;
  onBack: () => void;
  /**
   * 고르거나 지울 때마다 퍼널 context를 갈아 끼운다 — 로컬 state에 같은 값을 또 두지 않는다.
   * `history.replace`가 새 context로 다시 그려 주므로 이 화면은 context만 읽으면 된다.
   */
  onChangeTranscript: (transcript: File | undefined) => void;
  onNext: (transcript: File) => void;
  /** 이동 확인 모달에서 "이동하기"를 눌렀을 때 — K-스마트멘토를 연다 */
  onOpenGuide: () => void;
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);

  // objectURL은 안 풀어주면 파일을 바꿔 고를 때마다 메모리에 쌓인다
  useEffect(() => {
    if (!transcript) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(transcript);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [transcript]);

  const handleGuideConfirm = () => {
    setGuideModalOpen(false);
    onOpenGuide();
  };

  return (
    <>
      <FeeTransferStepLayout
        actions={
          <ActionAreaButton
            disabled={!transcript}
            onClick={() => transcript && onNext(transcript)}
            sx={{ paddingBlock: "16px" }}
          >
            다음
          </ActionAreaButton>
        }
        description="홈 > ‘학점이수현황 자세히 보기’에 있어요."
        onBack={onBack}
        title={
          <>
            {/* Figma에서 "K스마트멘토↗"만 primary + 밑줄이고, 누르면 이동 확인 모달이 뜬다 */}
            <button
              className="underline"
              onClick={() => setGuideModalOpen(true)}
              type="button"
            >
              <Typography
                as="span"
                color="semantic.primary.normal"
                variant="heading1"
                weight="bold"
              >
                K스마트멘토↗
              </Typography>
            </button>
            에서
            <br />
            학점이수현황을 캡처해 주세요
          </>
        }
      >
        <FeeTranscriptGuide />
        {transcript ? (
          <FeeUploadedFileCard
            fileName={transcript.name}
            onPreview={() => setPreviewOpen(true)}
            onRemove={() => onChangeTranscript(undefined)}
          />
        ) : (
          <FeeImageUploadButton onSelect={onChangeTranscript} />
        )}
      </FeeTransferStepLayout>

      <ConfirmModal
        cancelLabel="취소"
        confirmLabel="이동하기"
        description={
          "K스마트멘토 사이트로 이동하여\n이수학기 화면을 확인할 수 있어요."
        }
        onCancel={() => setGuideModalOpen(false)}
        onConfirm={handleGuideConfirm}
        open={isGuideModalOpen}
        title="K스마트멘토로 이동할까요?"
      />

      <FeeImagePreviewOverlay
        alt={transcript ? `업로드한 이미지 ${transcript.name}` : ""}
        onClose={() => setPreviewOpen(false)}
        open={isPreviewOpen && Boolean(previewUrl)}
        src={previewUrl}
      />
    </>
  );
}

export default FeeTransferTranscriptStep;
