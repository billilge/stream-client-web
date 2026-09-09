import { Route, Routes } from "react-router-dom";

import ScreenLayout from "@/components/ui/ScreenLayout";
import BililgeListScreen from "@/features/bililge/BililgeListScreen";
import HomeScreen from "@/features/home/HomeScreen";

// 데스크톱에서 보기 좋게 아이폰 화면 크기로 가운데 정렬만 해준다.
function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] py-6">
      <Routes>
        <Route element={<ScreenLayout />}>
          <Route element={<HomeScreen />} path="/" />
          <Route element={<BililgeListScreen />} path="/bililge" />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
