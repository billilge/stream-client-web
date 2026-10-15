// 본문 맨 아래에 두는 하단 Home Bar 자리.
// env(safe-area-inset-bottom)이라 앱 WebView(네이티브가 이미 인셋)에서는 0이 되고,
// 폰 브라우저·PWA에서만 실제 인셋이 잡힌다. 데스크톱 프레임(sm 이상)에서는 Figma대로 34px을
// 흉내 낸다 — BottomNav가 자기 영역에서 쓰는 규칙과 같다.
// Action Area가 있는 화면은 WDS가 이미 아래 padding 20px을 주므로 h-safe-bottom-extra를 쓴다.
function ScreenBottomSafeArea() {
  return <div className="h-safe-bottom sm:h-[34px]" />;
}

export default ScreenBottomSafeArea;
