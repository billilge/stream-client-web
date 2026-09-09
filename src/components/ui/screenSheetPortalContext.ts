import { createContext } from "react";

// BottomSheet가 포털로 렌더링될 위치. ScreenLayout의 375×812 프레임 최상단에 고정된 빈 div를
// 가리켜서, 헤더/본문/Bottom Nav보다 위에 겹쳐 그려지면서도 브라우저 전체가 아니라 그 프레임
// 안에서만 딤 처리된다.
export const ScreenSheetPortalContext = createContext<HTMLDivElement | null>(
  null,
);
