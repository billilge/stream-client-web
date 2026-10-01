/**
 * 웹 → 앱 postMessage 브리지.
 *
 * `window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }))`로 보낸다.
 * `type`은 메시지 표식, `payload`는 메시지별 본문이다. 송신하는 쪽은 봉투 형식을 모르고
 * `postBridgeMessage(type, payload)`만 부른다.
 *
 * 수신부: stream-client-app의 `src/features/webview/bridge/bridge.ts`.
 *
 * 메시지 추가 절차:
 *   1. `messages/<이름>.ts`에 type 상수 · payload 인터페이스 (앱과 같은 이름·같은 필드)
 *   2. 아래 `BridgePayloads`에 한 줄 등록 — `postBridgeMessage`의 타입은 여기서 파생된다
 *   3. stream-client-app에 같은 type 상수로 파서·핸들러 작성 (PR을 서로 링크)
 */

import {
  SAFE_AREA_COLORS_MESSAGE_TYPE,
  type SafeAreaColorsPayload,
} from "@/lib/bridge/messages/safeAreaColors";

// stream-client-app(WebView 셸)이 주입하는 전역. 브라우저로 열면 없다.
declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

interface BridgePayloads {
  [SAFE_AREA_COLORS_MESSAGE_TYPE]: SafeAreaColorsPayload;
}

type BridgeMessageType = keyof BridgePayloads;

/** 앱 셸 안에서 열렸는지. 브라우저·개발 뷰에서는 `false`. */
export function isInAppShell(): boolean {
  return window.ReactNativeWebView !== undefined;
}

/**
 * 앱 셸에 메시지를 보낸다. 셸 밖(브라우저)이면 아무것도 하지 않는다.
 * 단방향이라 앱이 받았는지는 알 수 없다 — 앱은 모르는 메시지·형식 불일치를 조용히 버린다.
 */
export function postBridgeMessage<K extends BridgeMessageType>(
  type: K,
  payload: BridgePayloads[K],
): void {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ payload, type }));
}
