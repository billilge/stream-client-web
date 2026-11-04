import { Suspense } from "react";

import LockersMapSkeleton from "@/features/lockers/components/LockersMapSkeleton";
import LockersMineContent from "@/features/lockers/components/LockersMineContent";
import { LOCKER_ASSIGNMENT_PATH } from "@/features/lockers/constants/lockers";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// 사물함 배정 상태의 "사물함 위치 보기" — Figma에 따로 없어서 칸 선택 화면(A-1구역 2159:110753)
// 배치를 보기 전용으로 쓴다. 다른 칸은 누를 수 없고 내 칸만 선택된 칸 모양으로 표시한다.
function LockersMineScreen() {
  // 바로 들어와 뒤로 갈 히스토리가 없으면 배정 상태 화면으로 보낸다
  const goBack = useBackNavigation(LOCKER_ASSIGNMENT_PATH);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Suspense fallback={<LockersMapSkeleton />}>
        <LockersMineContent
          fallbackPath={LOCKER_ASSIGNMENT_PATH}
          onBack={goBack}
        />
      </Suspense>
    </div>
  );
}

export default LockersMineScreen;
