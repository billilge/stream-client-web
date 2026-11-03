import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconImage, IconReset } from "@wanteddev/wds-icon";
import { Suspense, useMemo, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import ComingSoonScreen from "@/app/ComingSoonScreen";
import emptyEventsIllustration from "@/assets/icons/common/empty-events.svg";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import SubmittingOverlay from "@/components/ui/SubmittingOverlay";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersLayoutRenderer from "@/features/lockers/components/LockersLayoutRenderer";
import LockersLegend from "@/features/lockers/components/LockersLegend";
import LockersMapSkeleton from "@/features/lockers/components/LockersMapSkeleton";
import LockersMapView from "@/features/lockers/components/LockersMapView";
import LockersSectionPhotoModal from "@/features/lockers/components/LockersSectionPhotoModal";
import LockersSelectedLockerBar from "@/features/lockers/components/LockersSelectedLockerBar";
import { LOCKERS_APPLY_SUBMITTING_TEXT } from "@/features/lockers/constants/lockersApplySubmit";
import {
  type LockersSectionDetail,
  toLockersSectionDetail,
} from "@/features/lockers/constants/lockersSectionDetails";
import { useLockersApplySubmit } from "@/features/lockers/hooks/useLockersApplySubmit";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";
import { lockersQueries } from "@/shared/entities/lockers/lockersQueries";

// Figma: A-1구역 (nodeId 2159:110753), A-2구역 (2159:109533), A-1구역 실제사진 (2159:110174)
function LockersCellSelectScreen() {
  const sectionId = Number(useParams().sectionId);

  if (!Number.isInteger(sectionId) || sectionId <= 0) {
    return <ComingSoonScreen />;
  }

  // 구역이 바뀌면 고른 칸·스크롤을 처음부터 다시 잡는다
  return (
    <Suspense fallback={<LockersMapSkeleton />} key={sectionId}>
      <SectionPeriod sectionId={sectionId} />
    </Suspense>
  );
}

function SectionPeriod({ sectionId }: { sectionId: number }) {
  const { data: period } = useSuspenseQuery(lockersQueries.period());

  if (!period) {
    return <Navigate replace to="/lockers/apply/sections" />;
  }
  return (
    <SectionDetail
      lockerPeriodId={period.lockerPeriodId}
      sectionId={sectionId}
    />
  );
}

function SectionDetail({
  lockerPeriodId,
  sectionId,
}: {
  lockerPeriodId: number;
  sectionId: number;
}) {
  const { data: detail } = useSuspenseQuery({
    ...lockersQueries.sectionDetail(lockerPeriodId, sectionId),
    select: toLockersSectionDetail,
  });

  return (
    <SectionLockerSelect detail={detail} lockerPeriodId={lockerPeriodId} />
  );
}

function SectionLockerSelect({
  detail,
  lockerPeriodId,
}: {
  detail: LockersSectionDetail;
  lockerPeriodId: number;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedLockerNumber, setSelectedLockerNumber] = useState<
    number | null
  >(null);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUnavailableToastOpen, setIsUnavailableToastOpen] = useState(false);
  // 선택 불가 칸을 연달아 눌러도 토스트가 처음부터 다시 뜨고 스크린리더가 다시 읽도록 key로 새로 그린다
  const [unavailableTapCount, setUnavailableTapCount] = useState(0);
  const { isSubmitting, submit } = useLockersApplySubmit(
    String(detail.sectionId),
  );

  const lockers = useMemo(
    () =>
      new Map(detail.lockers.map((locker) => [locker.lockerNumber, locker])),
    [detail.lockers],
  );
  const selectedLocker =
    selectedLockerNumber === null
      ? undefined
      : lockers.get(selectedLockerNumber);

  // 선택 불가 칸은 고르지 않고 안내 토스트만 띄운다 — 이미 고른 칸은 그대로 둔다
  const handleSelect = (lockerNumber: number) => {
    if (lockers.get(lockerNumber)?.isAvailable) {
      setSelectedLockerNumber(lockerNumber);
      return;
    }
    setUnavailableTapCount((count) => count + 1);
    setIsUnavailableToastOpen(true);
  };

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
          {detail.photoUrls.length > 0 && (
            <TopNavigationButton
              aria-label="실제 사진 보기"
              onClick={() => setIsPhotoOpen(true)}
              variant="icon"
            >
              <IconImage />
            </TopNavigationButton>
          )}
          <TopNavigationButton
            aria-label="새로고침"
            onClick={() =>
              queryClient.refetchQueries({
                queryKey: lockersKeys.sectionDetail(
                  lockerPeriodId,
                  detail.sectionId,
                ),
              })
            }
            variant="icon"
          >
            <IconReset />
          </TopNavigationButton>
        </>
      }
      variant="normal"
    />,
  );

  if (!detail.layout) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="다른 구역을 선택해 주세요"
          illustration={emptyEventsIllustration}
          title="아직 칸 배치를 볼 수 없어요"
        />
      </div>
    );
  }

  const map = (
    <LockersLayoutRenderer
      layout={detail.layout}
      lockers={lockers}
      onSelect={handleSelect}
      selectedLockerNumber={selectedLockerNumber}
    />
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <LockersMapView legend={<LockersLegend />} map={map} />

      <LockersSelectedLockerBar
        lockerLabel={selectedLocker?.lockerLabel ?? null}
        onSubmit={() => setIsConfirmOpen(true)}
      />

      <LockersSectionPhotoModal
        onClose={() => setIsPhotoOpen(false)}
        open={isPhotoOpen}
        photoUrls={detail.photoUrls}
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
              lockerPeriodId,
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

      {/* Figma: 선택 불가능한 사물함 선택 시 토스트 (nodeId 2212:160304) */}
      <ScreenToast
        key={unavailableTapCount}
        message="다른 사물함을 선택해 주세요."
        onOpenChange={setIsUnavailableToastOpen}
        open={isUnavailableToastOpen}
        variant="cautionary"
      />
    </div>
  );
}

export default LockersCellSelectScreen;
