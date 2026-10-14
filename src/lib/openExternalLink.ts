// 서비스 밖 주소(구글폼 등)를 여는 자리. 화면은 이 함수만 부르고, 여는 방식이 바뀌면 여기만 고친다.
//
// **앱 WebView에서는 이 구현이 맞지 않을 수 있다.** 앱 안에서 `window.open`은 막히거나
// (아무 일도 안 일어남) WebView 안에서 그대로 열려서 사용자가 외부 페이지에 갇힌다 — 앱에는
// 주소창도 뒤로가기도 없다. 제대로 하려면 앱 셸에 "이 주소를 시스템 브라우저로 열어 달라"고
// 넘겨야 한다. 재료는 이미 `lib/bridge/`에 있다.
//
//   if (isInAppShell()) {
//     postBridgeMessage(OPEN_EXTERNAL_LINK_MESSAGE_TYPE, { url });
//     return;
//   }
//
// 지금 넣지 않은 이유: 브리지 메시지는 **앱 쪽에 받는 핸들러가 같이 들어가야** 동작한다
// (`bridge.ts` 주석의 메시지 추가 절차 3단계). 웹에만 넣으면 앱이 모르는 메시지로 조용히
// 버려서 지금과 결과가 같다. 게다가 연결할 구글폼 주소가 아직 없어서(SETTINGS_EXTERNAL_LINKS가
// 비어 있고 그동안 해당 행은 비활성이다) 급할 것도 없다.
//
// 주소와 앱 작업이 준비되면 위 분기를 여기에 채운다 — 호출부는 건드릴 필요가 없다.
export function openExternalLink(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
