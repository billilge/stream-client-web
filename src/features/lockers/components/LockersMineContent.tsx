import { use, useMemo } from "react";
import { Navigate } from "react-router-dom";

import { fetchMyLockerAssignment } from "@/entities/lockers/lockersApi";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLegend from "@/features/lockers/components/LockersLegend";
import LockersMapView from "@/features/lockers/components/LockersMapView";
import LockersMineBar from "@/features/lockers/components/LockersMineBar";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import { LOCKERS_SECTION_DETAILS } from "@/features/lockers/constants/lockersSectionDetails";

interface LockersMineContentProps {
  isPhotoOpen: boolean;
  onClosePhoto: () => void;
}

// 배정된 구역의 칸 배치를 보기 전용으로 그리고 내 칸만 표시한다.
// 내 칸은 배정 정보(entities/lockers)의 칸 이름 하나로 정한다 — 구역 칸 데이터의 isMine에 기대지 않고,
// 그 칸을 선택된 칸으로 넘겨 선택 모양(파란 배경)으로 그린다.
function LockersMineContent({
  isPhotoOpen,
  onClosePhoto,
}: LockersMineContentProps) {
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

  const myLocker = detail.lockers.find(
    (locker) => locker.lockerLabel === assignment.lockerLabel,
  );
  const map = (
    <LockersLayoutRenderer
      layout={detail.layout}
      lockers={lockers}
      selectedLockerNumber={myLocker?.lockerNumber ?? null}
    />
  );

  return (
    <>
      <LockersMapView legend={<LockersLegend variant="mine" />} map={map} />
      <LockersMineBar lockerLabel={assignment.lockerLabel} />
      <LockersSectionPhotoModal
        onClose={onClosePhoto}
        open={isPhotoOpen}
        photoUrl={detail.photoUrl}
        sectionName={detail.section}
      />
    </>
  );
}

export default LockersMineContent;
