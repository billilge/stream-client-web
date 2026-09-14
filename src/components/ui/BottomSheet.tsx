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
      className={`absolute inset-0 transition-opacity duration-300 ease-out ${
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
        className={`absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl bg-background-normal transition-transform duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-2 flex h-6 shrink-0 items-center justify-center">
          <div className="h-[5px] w-12 rounded-full bg-sheet-indicator" />
        </div>
        {children}
        {/* Figma의 Action Area는 버튼을 감싸는 Container(p-5=20px, 이건 WDS ActionArea 자체
            padding으로 이미 확보됨) 다음에 iOS 홈 인디케이터용 "Gesture" 여백(pt-3.5=14px)이
            하나 더 붙는데, 실제 @wanteddev/wds의 ActionArea 컴포넌트에는 이 14px이 없어서
            여기서 더해준다. */}
        <div className="h-[14px] shrink-0" />
      </div>
    </div>,
    portalEl,
  );
}

export default BottomSheet;
