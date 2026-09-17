import { Toast, ToastContainer, ToastContent, ToastIcon } from "@wanteddev/wds";
import { IconCircleExclamationFill } from "@wanteddev/wds-icon";
import { createPortal } from "react-dom";

import { useScreenSheetPortal } from "@/components/ui/useScreenSheetPortal";

interface ScreenToastProps {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
}

// Figma: Toast/Toast (nodeId 1450:93026). 배경·흐림·여백·모서리·글자가 모두 WDS Toast 기본값이라
// 그대로 쓰고, 두 가지만 우리가 맡는다.
// 1. 위치 — WDS 기본 배치는 자체 영역(#wds-region-manager-bottom)이라 375×812 프레임을 벗어난다.
//    화면 포털에 직접 그려서 Figma 좌표(좌우 20px, 아래에서 100px)에 놓는다.
// 2. 아이콘 — negative variant의 기본 아이콘은 X(Circle Close)인데 Figma는 느낌표라 직접 넘긴다.
function ScreenToast({ open, message, onOpenChange }: ScreenToastProps) {
  const portalEl = useScreenSheetPortal();

  if (!portalEl) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none absolute inset-x-5 bottom-[100px]">
      <Toast
        disablePortal
        onOpenChange={onOpenChange}
        open={open}
        // WDS는 화면이 sm 이상이면 토스트에 최소 356px을 주는데, 그 기준이 앱 프레임이 아니라 브라우저
        // 창이라 데스크톱에서 375px 프레임(좌우 20px 여백 기준 335px)을 넘친다.
        // 같은 조건에서만 되돌려 프레임 폭을 따르게 한다.
        sx={(theme) => ({
          [`@media only screen and (min-width: ${theme.breakpoint.sm})`]: {
            minWidth: 0,
            maxWidth: "100%",
          },
        })}
        variant="negative"
      >
        <ToastContainer>
          <ToastIcon>
            <span className="relative flex shrink-0 text-toast-negative">
              {/* 느낌표는 아이콘에서 뚫린 자리라 반투명한 토스트 배경이 그대로 비친다.
                  WDS 기본 아이콘과 같은 방식으로 흰 바탕을 뒤에 깔아 하얗게 보이게 한다. */}
              <span className="absolute top-1/2 left-1/2 h-[10px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-static-white" />
              <IconCircleExclamationFill className="relative" />
            </span>
          </ToastIcon>
          <ToastContent>{message}</ToastContent>
        </ToastContainer>
      </Toast>
    </div>,
    portalEl,
  );
}

export default ScreenToast;
