import { Outlet } from "react-router-dom";

// 모든 화면의 루트 레이아웃 — 라우트 정의는 router.tsx에 있다.
// 실사용자는 전부 stream-client-app의 WebView 안에서 보므로 폰(꽉 채움)이 기본이고,
// 아이폰 프레임 흉내는 개발 중에만 쓰는 데스크톱 뷰포트(sm 이상) 전용이다.
// 프레임 크기 자체는 ScreenLayout이 같은 브레이크포인트로 들고 있다.
function App() {
  return (
    <div className="sm:flex sm:min-h-screen sm:items-center sm:justify-center sm:bg-[#e5e5e5] sm:py-6">
      <Outlet />
    </div>
  );
}

export default App;
