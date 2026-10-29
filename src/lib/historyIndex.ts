// createBrowserRouter는 history.state.idx에 히스토리 스택 위치를 적어 둔다(push마다 1씩 증가).
// 화면으로 바로 들어오면(딥링크·앱 WebView 진입·새로고침 후 첫 화면) 0이다.
//
// react-router 내부가 정한 형태라 라이브러리를 올릴 때 깨질 수 있는 자리다. 여러 곳에서 각자
// 캐스팅하지 않고 여기서만 읽는다 — 읽는 쪽은 `ScreenLayoutRoute`(전환 방향 판정),
// `useBackNavigation`(뒤로 갈 곳이 있는지), `useFunnelExit`(퍼널 단계 수만큼 되돌아갈 수 있는지)뿐이다.
export function getHistoryIndex(): number | null {
  const state: unknown = window.history.state;
  if (
    typeof state === "object" &&
    state !== null &&
    "idx" in state &&
    typeof state.idx === "number"
  ) {
    return state.idx;
  }
  return null;
}
