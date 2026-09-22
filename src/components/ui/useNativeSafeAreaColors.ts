import { useEffect } from "react";

import type { ScreenBackground } from "@/components/ui/ScreenLayout";

// stream-client-app(WebView 셸)이 주입하는 전역. 브라우저로 열면 없다.
declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

// 앱이 자기 메시지인지 가려내는 표식. 바꾸면 stream-client-app의 수신부도 같이 바꿔야 한다.
const SAFE_AREA_COLORS_MESSAGE_TYPE = "safeAreaColors";

// 화면 배경 ↔ WDS 시맨틱 토큰. index.css가 Tailwind 색으로 별칭 연결해 둔 그 변수들이다.
const BACKGROUND_CSS_VARIABLES: Record<ScreenBackground, string> = {
  alternative: "--semantic-background-normal-alternative",
  normal: "--semantic-background-normal-normal",
};

function readCssVariable(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

// 앱은 WebView 위아래에 세이프에어리어 인셋 높이만큼 스트립을 깔고, 맞닿는 웹 화면과 같은 색으로
// 칠해 경계선을 없앤다. 앱은 웹의 DOM을 볼 수 없으므로(별도 저장소·별도 배포, WebView 안은
// 픽셀만 보인다) 웹이 자기 색을 알려주지 않으면 알 방법이 없다.
//
// hex를 앱에 복사해 두면 화면이 늘거나 토큰이 바뀔 때마다 두 저장소가 따로 어긋난다(#56) —
// 그래서 상수가 아니라 getComputedStyle로 지금 적용된 값을 읽어서 보낸다. 다크 테마가 붙어도
// 같은 경로로 따라간다.
//
// 어느 색을 보낼지는 라우트 11개를 실측해서 나온 규칙 그대로다.
//   top    = 컬럼 배경
//   bottom = Bottom Nav가 있으면 Nav 배경(bg-background-normal), 없으면 컬럼 배경이 곧 바닥
export function useNativeSafeAreaColors(
  background: ScreenBackground,
  hasBottomNav: boolean,
) {
  useEffect(() => {
    const bridge = window.ReactNativeWebView;
    if (!bridge) {
      return;
    }

    const top = readCssVariable(BACKGROUND_CSS_VARIABLES[background]);
    const bottom = hasBottomNav
      ? readCssVariable(BACKGROUND_CSS_VARIABLES.normal)
      : top;

    // 토큰을 못 읽었으면(WDS 로드 전 등) 보내지 않는다 — 앱이 자기 기본값을 유지하는 편이
    // 빈 문자열을 받아 검정으로 칠하는 것보다 낫다.
    if (!top || !bottom) {
      return;
    }

    bridge.postMessage(
      JSON.stringify({ bottom, top, type: SAFE_AREA_COLORS_MESSAGE_TYPE }),
    );
  }, [background, hasBottomNav]);
}
