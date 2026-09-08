import { useState } from "react";

import type { BottomNavValue } from "@/components/ui/BottomNav";
import ScreenLayout from "@/components/ui/ScreenLayout";

// 라우팅 도입 전까지 ScreenLayout 뼈대 확인용 임시 화면. 실제 화면 콘텐츠는 각 기능 작업에서 채운다.
// 데스크톱에서 보기 좋게 아이폰 화면 크기로 가운데 정렬만 해준다.
function App() {
  const [bottomNavValue, setBottomNavValue] = useState<BottomNavValue>("home");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] py-6">
      <ScreenLayout
        bottomNavValue={bottomNavValue}
        header={
          <div className="p-4">
            <h1 className="font-bold text-2xl text-label-normal">STREAM</h1>
          </div>
        }
        onBottomNavValueChange={setBottomNavValue}
      >
        <div className="flex items-center justify-center py-20 text-label-alternative text-sm">
          화면 콘텐츠는 각 기능에서 채운다
        </div>
      </ScreenLayout>
    </div>
  );
}

export default App;
