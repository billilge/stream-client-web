import { ActionAreaButton, Typography } from "@wanteddev/wds";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import FeeImagePreviewOverlay from "@/features/fee/components/FeeImagePreviewOverlay";
import FeeImageUploadButton from "@/features/fee/components/FeeImageUploadButton";
import FeeTranscriptGuide from "@/features/fee/components/FeeTranscriptGuide";
import FeeTransferStepLayout from "@/features/fee/components/FeeTransferStepLayout";
import FeeUploadedFileCard from "@/features/fee/components/FeeUploadedFileCard";
import {
  FEE_K_SMART_MENTOR_URL,
  FEE_TRANSFER_PATHS,
} from "@/features/fee/constants/fee";

// Figma: 계좌 송금 - 이미지 업로드하기 전 (nodeId 3562:162845) / 업로드 후 (3562:162891) /
// K-스마트멘토 이동 확인 모달 (3562:162940) / 업로드한 이미지 미리보기 (3595:70574)
//
// 네 프레임이 한 화면의 상태 변화라 라우트를 나누지 않고 업로드 여부·모달 열림으로 토글한다.
// 업로드 API가 아직 없어서 고른 파일을 그대로 들고만 있는다 — 미리보기는 objectURL로 띄우고,
// 연동할 때 이 자리에서 업로드 요청을 보내면 된다.
function FeeTransferTranscriptScreen() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);

  // objectURL은 안 풀어주면 파일을 바꿔 고를 때마다 메모리에 쌓인다
  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleGuideConfirm = () => {
    setGuideModalOpen(false);
    if (FEE_K_SMART_MENTOR_URL) {
      window.open(FEE_K_SMART_MENTOR_URL, "_blank", "noopener");
    }
  };

  return (
    <>
      <FeeTransferStepLayout
        actions={
          <ActionAreaButton
            disabled={!file}
            onClick={() => navigate(FEE_TRANSFER_PATHS.toss)}
            sx={{ paddingBlock: "16px" }}
          >
            다음
          </ActionAreaButton>
        }
        description="홈 > ‘학점이수현황 자세히 보기’에 있어요."
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
        {file ? (
          <FeeUploadedFileCard
            fileName={file.name}
            onPreview={() => setPreviewOpen(true)}
            onRemove={() => setFile(null)}
          />
        ) : (
          <FeeImageUploadButton onSelect={setFile} />
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
        alt={file ? `업로드한 이미지 ${file.name}` : ""}
        onClose={() => setPreviewOpen(false)}
        open={isPreviewOpen && Boolean(previewUrl)}
        src={previewUrl}
      />
    </>
  );
}

export default FeeTransferTranscriptScreen;
