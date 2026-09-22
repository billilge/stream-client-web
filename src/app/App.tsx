import { Outlet } from "react-router-dom";

// 모든 화면의 루트 레이아웃 — 라우트 정의는 router.tsx에 있다.
// 실사용자는 전부 stream-client-app의 WebView 안에서 보므로 폰(꽉 채움)이 기본이고,
// 데스크톱 뷰포트(sm 이상)에서는 화면을 가운데 컬럼으로 세운다. 컬럼은 높이를 고정하지 않고
// 뷰포트를 위아래로 꽉 채우므로(ScreenLayout의 h-dvh) 여기서 세로 여백을 주지 않는다 —
// 여백을 주면 낮은 뷰포트에서 컬럼 아래가 잘리고 페이지 전체가 스크롤된다.
// 양옆 여백은 화면과 같은 배경이고, 컬럼 경계는 ScreenLayout의 그림자가 표시한다.
function App() {
  return (
    <div className="sm:flex sm:min-h-dvh sm:justify-center sm:bg-background-normal">
      <Outlet />
    </div>
  );
}

export default App;
