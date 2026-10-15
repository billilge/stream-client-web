import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersAssignmentContent from "@/features/lockers/components/LockersAssignmentContent";
import LockersAssignmentSkeleton from "@/features/lockers/components/LockersAssignmentSkeleton";
import { MY_LOCKER_LOCATION_PATH } from "@/features/lockers/constants/lockers";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// Figma: 사물함 배정 상태 배정완료 (nodeId 3147:148357), 빈 상태 (3147:148331)
function LockersAssignmentScreen() {
  const navigate = useNavigate();

  // 바로 들어와 뒤로 갈 히스토리가 없으면 홈으로 보낸다
  const goBack = useBackNavigation("/");

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
      title="사물함 배정 상태"
      variant="normal"
    />,
  );

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <Suspense fallback={<LockersAssignmentSkeleton />}>
        <LockersAssignmentContent
          onViewLocation={() =>
            navigate(MY_LOCKER_LOCATION_PATH, { viewTransition: true })
          }
        />
      </Suspense>
    </div>
  );
}

export default LockersAssignmentScreen;
