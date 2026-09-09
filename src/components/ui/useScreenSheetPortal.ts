import { useContext } from "react";

import { ScreenSheetPortalContext } from "@/components/ui/screenSheetPortalContext";

// BottomSheet가 포털로 그려질 DOM 노드를 가져온다. 마운트 첫 렌더에는 ref가 아직 안 붙어서
// null일 수 있으므로(프로그래밍 오류가 아니라 정상적인 과도 상태), 호출부에서 null을 직접 처리한다.
export function useScreenSheetPortal() {
  return useContext(ScreenSheetPortalContext);
}
