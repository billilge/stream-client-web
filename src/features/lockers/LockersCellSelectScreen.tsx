import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage, IconReset } from "@wanteddev/wds-icon";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ComingSoonScreen from "@/app/ComingSoonScreen";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SubmittingOverlay from "@/components/ui/SubmittingOverlay";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersMapView from "@/features/lockers/components/LockersMapView";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import LockersSelectedLockerBar from "@/features/lockers/components/LockersSelectedLockerBar";
import { LOCKERS_APPLY_SUBMITTING_TEXT } from "@/features/lockers/constants/lockersApplySubmit";
import {
  LOCKERS_SECTION_DETAILS,
  type LockersSectionDetail,
} from "@/features/lockers/constants/lockersSectionDetails";
import { useLockersApplySubmit } from "@/features/lockers/hooks/useLockersApplySubmit";

// Figma: A-1구역 (nodeId 2159:110753), A-2구역 (2159:109533), A-1구역 실제사진 (2159:110174)
function LockersCellSelectScreen() {
  const { sectionId = "" } = useParams();
  const detail = LOCKERS_SECTION_DETAILS[sectionId];

  if (detail === undefined) {
    return <ComingSoonScreen />;
  }

  // 구역이 바뀌면 고른 칸·스크롤을 처음부터 다시 잡는다
  return <SectionLockerSelect detail={detail} key={sectionId} />;
}

function SectionLockerSelect({ detail }: { detail: LockersSectionDetail }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<
    number | null
  >(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { isSubmitting, submit } = useLockersApplySubmit(detail.section);

  const lockers = useMemo(
    () =>
      new Map(detail.lockers.map((locker) => [locker.lockerNumber, locker])),
    [detail.lockers],
  );
  const selectedLocker =
    selectedLockerNumber === null
      ? undefined
      : lockers.get(selectedLockerNumber);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          // 구역 선택 화면에서 들어왔으면 그 기록으로 돌아간다. 주소로 바로 들어와 앱 안의 이전
          // 기록이 없으면(location.key === "default") 앱 밖으로 나가지 않게 구역 선택 화면으로 보낸다.
          onClick={() =>
            location.key === "default"
              ? navigate("/lockers/apply/sections", { replace: true })
              : navigate(-1)
          }
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title={`${detail.section}구역 사물함 선택`}
      trailing={
        <>
          <TopNavigationButton
            aria-label="실제 사진 보기"
            onClick={() => setIsPhotoOpen(true)}
            variant="icon"
          >
            <IconImage />
          </TopNavigationButton>
          <TopNavigationButton
            aria-label="새로고침"
            // 구역 선택 화면과 같다 — 칸 현황 API가 붙으면 그 조회만 다시 하도록 바꾼다
            onClick={() => window.location.reload()}
            variant="icon"
          >
            <IconReset />
          </TopNavigationButton>
        </>
      }
      variant="normal"
    />,
  );

  const map = (
    <LockersLayoutRenderer
      layout={detail.layout}
      lockers={lockers}
      onSelect={setSelectedLockerNumber}
      selectedLockerNumber={selectedLockerNumber}
    />
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <LockersMapView map={map} />

      <LockersSelectedLockerBar
        lockerLabel={selectedLocker?.lockerLabel ?? null}
        onSubmit={() => setIsConfirmOpen(true)}
      />

      <LockersSectionPhotoModal
        onClose={() => setIsPhotoOpen(false)}
        open={isPhotoOpen}
        photoUrl={detail.photoUrl}
        sectionName={detail.section}
      />

      {/* Figma: 사물함 선택 확인 모달 (nodeId 1737:218322) */}
      <ConfirmModal
        cancelLabel="수정"
        confirmLabel="신청하기"
        description="신청 후에는 변경할 수 없어요."
        highlight={selectedLocker?.lockerLabel}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          if (selectedLocker) {
            submit({
              lockerId: selectedLocker.lockerId,
              lockerLabel: selectedLocker.lockerLabel,
            });
          }
        }}
        open={isConfirmOpen}
        title="사물함을 신청할까요?"
      />

      <SubmittingOverlay
        description={LOCKERS_APPLY_SUBMITTING_TEXT.description}
        open={isSubmitting}
        title={LOCKERS_APPLY_SUBMITTING_TEXT.title}
      />
    </div>
  );
}

export default LockersCellSelectScreen;
