import { Typography } from "@wanteddev/wds";
import { IconCircleCheckFill } from "@wanteddev/wds-icon";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface BililgeReturnToastProps {
  open: boolean;
  // 토스트가 떠 있는 중에 다시 확인해도 스크린리더가 재안내하도록, 확인마다 바뀌는 값을
  // 메시지 텍스트의 key로 써서 강제로 다시 마운트한다.
  messageKey: number;
}

// Figma: 반납 신청 완료 토스트(nodeId 1133:50035, Toast/Toast) — WDS `useToast`/`Toast`는
// 화면 전용 포털(#wds-region-manager-bottom)에 그려서 실제 뷰포트 기준으로 뜬다. 이 앱은
// 데스크톱에서 폭이 고정된 컬럼을 화면 가운데에 세우는 구조라(App.tsx), WDS 토스트를 그대로
// 쓰면 컬럼 밖 실제 뷰포트 하단에 떠버린다 — Bottom Nav를 WDS 대신 로컬로 다시 만든 것과
// 같은 이유(wds-component-usage.md "Bottom Nav" 절 참고)로 BottomSheet와 같은 포털 슬롯에
// 직접 그린다. 아이콘·타이포·배경(두 겹 반투명 레이어)은 Figma 그대로 옮겼다.
//
// role="status"/aria-live="polite"로 스크린리더에도 안내한다(코드리뷰 지적 반영). 메시지
// 텍스트에 messageKey를 key로 줘서, 토스트가 떠 있는 중에 다시 확인해도(연속 확인) 텍스트가
// 새로 마운트되며 재안내되게 한다.
function BililgeReturnToast({ open, messageKey }: BililgeReturnToastProps) {
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
      <div
        aria-live="polite"
        className="relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-[11px] backdrop-blur-[32px]"
        role="status"
      >
        <div className="absolute inset-0 bg-inverse-background/52" />
        <div className="absolute inset-0 bg-primary/5" />
        <IconCircleCheckFill className="relative size-[22px] shrink-0 text-status-positive" />
        <Typography
          className="relative"
          color="semantic.static.white"
          key={messageKey}
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
