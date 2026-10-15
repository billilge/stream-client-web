import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getHistoryIndex } from "@/lib/historyIndex";

/**
 * 헤더 뒤로가기 동작. 앱 안에서 타고 들어왔으면 한 단계 뒤로 가고, 이 화면으로 **바로**
 * 들어왔으면(딥링크·앱 WebView 진입·주소 직접 입력) `fallbackPath`로 보낸다.
 *
 * 바로 들어온 경우 `navigate(-1)`은 뒤에 갈 화면이 없어서 아무 일도 하지 않는다 — 사용자
 * 입장에서는 뒤로가기 버튼이 먹통이고, 모달을 띄워 둔 화면이면 그대로 갇힌다.
 *
 * `fallbackPath`는 그 화면의 "한 단계 위"를 준다(알림 설정 → 알림 목록, 행사 신청 → 행사 목록).
 * 되돌아올 화면이 아니라 대신 가는 곳이라 히스토리를 치환(`replace`)한다.
 */
export function useBackNavigation(fallbackPath: string) {
  const navigate = useNavigate();

  return useCallback(() => {
    const historyIndex = getHistoryIndex();
    if (historyIndex !== null && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath, { replace: true });
  }, [navigate, fallbackPath]);
}
