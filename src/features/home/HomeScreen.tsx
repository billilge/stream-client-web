import { Link } from "react-router-dom";

import ScreenLayout from "@/components/ui/ScreenLayout";

// 홈 화면 콘텐츠는 아직 없어서, 라우팅이 실제로 동작하는지 확인할 placeholder만 둔다.
function HomeScreen() {
  return (
    <ScreenLayout
      header={
        <div className="p-4">
          <h1 className="font-bold text-2xl text-label-normal">STREAM</h1>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-label-alternative text-sm">
          홈 화면은 아직 준비 중이에요
        </p>
        <Link className="text-primary text-sm underline" to="/rental">
          빌릴게 화면 보기
        </Link>
      </div>
    </ScreenLayout>
  );
}

export default HomeScreen;
