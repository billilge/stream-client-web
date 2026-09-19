import { Typography } from "@wanteddev/wds";
import { IconCircleCheckFill } from "@wanteddev/wds-icon";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface BililgeReturnToastProps {
  open: boolean;
}

// Figma: 반납 신청 완료 토스트(nodeId 1133:50035, Toast/Toast) — WDS `useToast`/`Toast`는
// 화면 전용 포털(#wds-region-manager-bottom)에 그려서 실제 뷰포트 기준으로 뜬다. 이 앱은
// 375×812 고정 프레임을 데스크톱 화면 가운데에 띄우는 구조라(App.tsx), WDS 토스트를 그대로
// 쓰면 프레임 밖 실제 뷰포트 하단에 떠버린다 — Bottom Nav를 WDS 대신 로컬로 다시 만든 것과
// 같은 이유(wds-component-usage.md "Bottom Nav" 절 참고)로 BottomSheet와 같은 포털 슬롯에
// 직접 그린다. 아이콘·타이포·배경(두 겹 반투명 레이어)은 Figma 그대로 옮겼다.
function BililgeReturnToast({ open }: BililgeReturnToastProps) {
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div
      className={`absolute inset-x-5 bottom-24 transition-opacity duration-200 ease-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-[11px] backdrop-blur-[32px]">
        <div className="absolute inset-0 bg-inverse-background/52" />
        <div className="absolute inset-0 bg-primary/5" />
        <IconCircleCheckFill className="relative size-[22px] shrink-0 text-status-positive" />
        <Typography
          className="relative"
          color="semantic.static.white"
          variant="body2"
          weight="bold"
        >
          반납 신청이 완료됐어요.
        </Typography>
      </div>
    </div>,
    portalEl,
  );
}

export default BililgeReturnToast;
