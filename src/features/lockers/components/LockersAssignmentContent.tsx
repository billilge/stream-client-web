import { Button, Typography } from "@wanteddev/wds";
import { IconChevronRight } from "@wanteddev/wds-icon";
import { use } from "react";

import StatusSummaryCard from "@/components/ui/StatusSummaryCard";
import { fetchMyLockerAssignment } from "@/entities/lockers/lockersApi";
import LockersEmptyState from "@/features/lockers/components/LockersEmptyState";
import { LOCKER_STATUS_BADGES } from "@/features/lockers/constants/lockers";
import { formatDate, formatDateTime } from "@/lib/date";

// 이 화면에 오는 배정은 항상 배정완료다(기간종료·미신청은 홈 배지에서만 쓴다)
const ASSIGNED_BADGE = LOCKER_STATUS_BADGES.assigned;

interface LockersAssignmentContentProps {
  onViewLocation: () => void;
}

// Figma: 사물함 배정 상태 배정완료 (nodeId 3147:148357), 빈 상태 (3147:148331)
// 배정 요약은 공용 StatusSummaryCard, 배정된 사물함 카드는 사물함 로컬 카드다.
function LockersAssignmentContent({
  onViewLocation,
}: LockersAssignmentContentProps) {
  const assignment = use(fetchMyLockerAssignment());

  if (!assignment) {
    // TODO: 연도(학기 기준)는 API가 붙으면 서버 값으로 받는다 — 지금은 기기 시계의 올해다
    const year = new Date().getFullYear();
    return (
      <div className="flex justify-center pt-50">
        <LockersEmptyState title={`${year} 사물함 신청내역이 없어요`} />
      </div>
    );
  }

  const rows = [
    {
      label: "신청일시",
      value: formatDateTime(assignment.appliedAt, { weekday: true }),
    },
    {
      label: "사용기한",
      value: `${formatDate(assignment.usageStartDate, { weekday: true })} - ${formatDate(assignment.usageEndDate, { weekday: true })}`,
    },
  ];

  return (
    <div className="flex flex-col gap-2 px-5 pb-4">
      <StatusSummaryCard
        badge={ASSIGNED_BADGE}
        rows={rows}
        title={`${assignment.semester} 사물함`}
      />

      <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
        <div className="flex flex-col gap-1">
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            배정된 사물함
          </Typography>
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="headline2"
            weight="bold"
          >
            <Typography
              color="semantic.primary.normal"
              variant="headline2"
              weight="bold"
            >
              {assignment.lockerLabel}
            </Typography>{" "}
            사물함
          </Typography>
        </div>
        <Button
          color="assistive"
          fullWidth
          onClick={onViewLocation}
          size="medium"
          trailingContent={<IconChevronRight />}
          variant="outlined"
        >
          사물함 위치 보기
        </Button>
      </div>
    </div>
  );
}

export default LockersAssignmentContent;
