import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// Figma: Views / Bottom Sheets (nodeId 1422:57176) — WDS에는 대응하는 코드 컴포넌트가 없다
// (component-convention.md 참고: Native / Bottom Sheet Indicator는 Stream/iOS 목업 전용 로컬 요소).
// 딤+시트를 ScreenLayout의 포털 슬롯(useScreenSheetPortal)에 그려서 375×812 프레임 전체를 덮는다.
function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      className={`absolute inset-0 transition-opacity duration-200 ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <button
        aria-label="시트 닫기"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl bg-background-normal transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-2 flex h-6 shrink-0 items-center justify-center">
          <div className="h-[5px] w-12 rounded-full bg-sheet-indicator" />
        </div>
        {children}
        {/* Figma: Native / Home Indicator (nodeId 1422:57206) — 이 시트가 열려있는 동안은 화면
            맨 아래 chrome 역할을 하므로, BottomNav 대신 여기서 안전 영역 + 홈 인디케이터 바를
            직접 그린다. */}
        <div className="relative h-[34px] shrink-0">
          <div className="absolute bottom-2 left-1/2 h-[5px] w-[148px] -translate-x-1/2 rounded-full bg-ink-darkest" />
        </div>
      </div>
    </div>,
    portalEl,
  );
}

export default BottomSheet;
