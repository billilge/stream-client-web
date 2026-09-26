/**
 * 세이프에어리어 스트립 색 메시지.
 *
 * 앱은 WebView 위아래에 세이프에어리어 인셋 높이만큼 스트립을 깔고, 맞닿는 웹 화면과 같은 색으로
 * 칠해 경계선을 없앤다. 그 색은 화면마다 다르고 웹만 알기 때문에 웹이 보낸다.
 *
 * 수신부: stream-client-app의 `src/features/webview/bridge/messages/safeAreaColors.ts`.
 * 표식 문자열과 payload 필드 이름은 양쪽이 맞춰야 한다.
 */

export const SAFE_AREA_COLORS_MESSAGE_TYPE = "safeAreaColors";

export interface SafeAreaColorsPayload {
  bottom: string;
  top: string;
}
