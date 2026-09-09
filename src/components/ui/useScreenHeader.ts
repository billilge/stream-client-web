import type { ReactNode } from "react";
import { useContext, useEffect } from "react";

import { ScreenHeaderContext } from "@/components/ui/screenHeaderContext";

// 화면(라우트)이 자신의 헤더(Top Navigation 등)를 ScreenLayout의 header 슬롯에 등록한다.
// ScreenLayout이 라우터에서 부모 route로 화면을 감싸기 때문에, 화면은 <ScreenLayout>을
// 직접 감쌀 필요 없이 이 훅만 호출하면 된다 — 감싸는 걸 깜빡하는 불일치가 구조적으로 없어진다.
export function useScreenHeader(header: ReactNode) {
  const setHeader = useContext(ScreenHeaderContext);

  if (!setHeader) {
    throw new Error(
      "useScreenHeader는 ScreenLayout의 하위 라우트에서만 쓸 수 있다",
    );
  }

  useEffect(() => {
    setHeader(header);
    return () => setHeader(null);
  }, [header, setHeader]);
}
