import { TopNavigationButton } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface FeeImagePreviewOverlayProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

// Figma: 업로드한 이미지 미리보기 (nodeId 3595:70574)
// 업로드한 캡처를 전체 화면으로 키워 보는 오버레이. 헤더가 X 하나뿐이라 화면 라우트로 두지 않고
// 업로드 화면 위에 포털로 띄운다 — 뒤로가기로 업로드 단계가 사라지면 안 되기 때문이다.
function FeeImagePreviewOverlay({
  open,
  src,
  alt,
  onClose,
}: FeeImagePreviewOverlayProps) {
  const portalEl = useScreenSheetPortal();

  // 이미지 뷰어는 Esc로 닫는 게 기본 동작이라 모달과 같이 맞춘다
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!portalEl || !open) {
    return null;
  }

  return createPortal(
    <div
      aria-label="업로드한 이미지 미리보기"
      aria-modal="true"
      className="absolute inset-0 flex flex-col bg-background-normal"
      role="dialog"
    >
      <div className="flex shrink-0 justify-end p-4">
        <TopNavigationButton aria-label="닫기" onClick={onClose} variant="icon">
          <IconClose />
        </TopNavigationButton>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-10 pb-10">
        <img alt={alt} className="w-full object-contain" src={src} />
      </div>
    </div>,
    portalEl,
  );
}

export default FeeImagePreviewOverlay;
