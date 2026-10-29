import { TopNavigationButton } from "@wanteddev/wds";
import { IconClose } from "@wanteddev/wds-icon";
import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  // 미리보기를 연 버튼(파일 행) — 닫을 때 초점을 여기로 돌려준다
  const openerRef = useRef<HTMLElement | null>(null);

  // 열릴 때 초점을 오버레이 안으로 옮기고, 닫힐 때 열었던 버튼으로 되돌린다. 안 하면 오버레이가
  // 떠 있는 동안 초점이 뒤 화면에 남아서, 키보드·스크린리더로는 가려진 화면을 계속 조작하게 된다.
  // 초점을 받을 요소는 닫기 버튼 하나뿐이라 컨테이너에서 첫 버튼을 찾는다(WDS 컴포넌트에
  // ref를 넘길 수 있는지에 기대지 않는다).
  useEffect(() => {
    // portalEl은 마운트 첫 렌더에 null일 수 있다 — 그때는 오버레이가 아직 안 그려져서
    // 초점을 옮길 버튼도 없다. 포털이 생긴 렌더에서 다시 돌게 의존성에 둔다.
    if (!open || !portalEl) {
      return;
    }
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialogRef.current?.querySelector("button")?.focus();

    return () => openerRef.current?.focus();
  }, [open, portalEl]);

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
      ref={dialogRef}
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
