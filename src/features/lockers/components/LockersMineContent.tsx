import { useSuspenseQuery } from "@tanstack/react-query";
import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLegend from "@/features/lockers/components/LockersLegend";
import LockersMapView from "@/features/lockers/components/LockersMapView";
import LockersMineBar from "@/features/lockers/components/LockersMineBar";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import {
  lockersQueries,
  toLockerAssignment,
  toLockersSectionDetail,
} from "@/shared/entities/lockers/lockersQueries";
import type { LockerAssignment } from "@/shared/entities/lockers/lockersTypes";

interface LockersMineContentProps {
  /** 배정이 없거나 구역 배치가 없으면 보낼 곳 — 이동할 경로는 화면이 정한다 */
  fallbackPath: string;
  onBack: () => void;
}

// 배정된 구역의 칸 배치를 보기 전용으로 그리고 내 칸만 표시한다.
// 헤더의 사진 버튼이 구역 사진 유무에 따라 달라서 헤더도 여기서 등록한다(칸 선택 화면과 같다).
function LockersMineContent({ fallbackPath, onBack }: LockersMineContentProps) {
  const { data: assignment } = useSuspenseQuery({
    ...lockersQueries.myApplications(),
    select: toLockerAssignment,
  });

  if (!assignment) {
    return <Navigate replace to={fallbackPath} />;
  }
  return (
    <MineSection
      assignment={assignment}
      fallbackPath={fallbackPath}
      onBack={onBack}
    />
  );
}

// 내 칸은 배정 정보(shared/entities/lockers)의 칸 이름 하나로 정한다 — 구역 칸 데이터의 isMine에 기대지 않고,
// 그 칸을 선택된 칸으로 넘겨 선택 모양(파란 배경)으로 그린다.
function MineSection({
  assignment,
  fallbackPath,
  onBack,
}: LockersMineContentProps & { assignment: LockerAssignment }) {
  const { data: detail } = useSuspenseQuery({
    ...lockersQueries.sectionDetail(
      assignment.lockerPeriodId,
      assignment.sectionId,
    ),
    select: toLockersSectionDetail,
  });
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={onBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="내 사물함"
      trailing={
        detail.photoUrls.length > 0 && (
          <TopNavigationButton
            aria-label="실제 사진 보기"
            onClick={() => setIsPhotoOpen(true)}
            variant="icon"
          >
            <IconImage />
          </TopNavigationButton>
        )
      }
      variant="normal"
    />,
  );

  const lockers = useMemo(
    () =>
      new Map(detail.lockers.map((locker) => [locker.lockerNumber, locker])),
    [detail.lockers],
  );

  // 구역 배치가 없으면 볼 칸이 없어서 배정 상태 화면으로 돌려보낸다
  if (!detail.layout) {
    return <Navigate replace to={fallbackPath} />;
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
        onClose={() => setIsPhotoOpen(false)}
        open={isPhotoOpen}
        photoUrls={detail.photoUrls}
        sectionName={detail.section}
      />
    </>
  );
}

export default LockersMineContent;
