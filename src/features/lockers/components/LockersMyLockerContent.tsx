import { use, useMemo } from "react";
import { Navigate } from "react-router-dom";

import { fetchMyLockerAssignment } from "@/entities/lockers/lockersApi";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLockerMapView from "@/features/lockers/components/LockersLockerMapView";
import LockersMyLockerBar from "@/features/lockers/components/LockersMyLockerBar";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import { LOCKERS_SECTION_DETAILS } from "@/features/lockers/constants/lockersSectionDetails";

interface LockersMyLockerContentProps {
  isPhotoOpen: boolean;
  onClosePhoto: () => void;
}

// 배정된 구역의 칸 배치를 보기 전용으로 그리고 내 칸만 표시한다.
function LockersMyLockerContent({
  isPhotoOpen,
  onClosePhoto,
}: LockersMyLockerContentProps) {
  const assignment = use(fetchMyLockerAssignment());
  const detail = assignment
    ? LOCKERS_SECTION_DETAILS[assignment.sectionId]
    : undefined;

  const lockers = useMemo(
    () =>
      new Map(
        (detail?.lockers ?? []).map((locker) => [locker.lockerNumber, locker]),
      ),
    [detail],
  );

  // 배정이 없거나 구역 배치가 없으면 볼 칸이 없어서 배정 상태 화면으로 돌려보낸다
  if (!assignment || !detail) {
    return <Navigate replace to="/my/locker" />;
  }

  const map = (
    <LockersLayoutRenderer
      layout={detail.layout}
      lockers={lockers}
      selectedLockerNumber={null}
    />
  );

  return (
    <>
      <LockersLockerMapView isViewOnly map={map} />
      <LockersMyLockerBar lockerLabel={assignment.lockerLabel} />
      <LockersSectionPhotoModal
        onClose={onClosePhoto}
        open={isPhotoOpen}
        photoUrl={detail.photoUrl}
        sectionName={detail.section}
      />
    </>
  );
}

export default LockersMyLockerContent;
