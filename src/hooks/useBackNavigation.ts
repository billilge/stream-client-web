import { useNavigate } from "react-router-dom";

// 뒤로가기 버튼 동작 — 앱 안에서 들어왔으면 이전 화면으로, 주소로 바로 들어와 앱 안에 뒤로 갈
// 기록이 없으면 fallbackPath로 바꿔 보낸다(앱 밖으로 나가지 않게).
// createBrowserRouter는 history.state.idx에 히스토리 스택 위치를 적어 두고, 첫 화면은 0이다.
export function useBackNavigation(fallbackPath: string) {
  const navigate = useNavigate();

  return () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath, { replace: true });
  };
}
