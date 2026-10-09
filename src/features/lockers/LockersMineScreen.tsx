import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersMineContent from "@/features/lockers/components/LockersMineContent";
import LockersMineSkeleton from "@/features/lockers/components/LockersMineSkeleton";

// 사물함 배정 상태의 "사물함 위치 보기" — Figma에 따로 없어서 칸 선택 화면(A-1구역 2159:110753)
// 배치를 보기 전용으로 쓴다. 다른 칸은 누를 수 없고 내 칸만 선택된 칸 모양으로 표시한다.
function LockersMineScreen() {
  const navigate = useNavigate();
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  // 바로 들어와 뒤로 갈 히스토리가 없으면 배정 상태 화면으로 보낸다
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/my/locker", { replace: true });
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="내 사물함"
      trailing={
        <TopNavigationButton
          aria-label="실제 사진 보기"
          onClick={() => setIsPhotoOpen(true)}
          variant="icon"
        >
          <IconImage />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Suspense fallback={<LockersMineSkeleton />}>
        <LockersMineContent
          isPhotoOpen={isPhotoOpen}
          onClosePhoto={() => setIsPhotoOpen(false)}
        />
      </Suspense>
    </div>
  );
}

export default LockersMineScreen;
