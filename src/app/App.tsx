import { Outlet } from "react-router-dom";

// 모든 화면의 루트 레이아웃 — 데스크톱에서 보기 좋게 아이폰 화면 크기로 가운데 정렬만 해준다.
// 라우트 정의는 router.tsx에 있다.
function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] py-6">
      <Outlet />
    </div>
  );
}

export default App;
