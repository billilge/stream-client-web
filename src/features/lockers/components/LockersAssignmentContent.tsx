import { Button, ContentBadge, Typography } from "@wanteddev/wds";
import { IconChevronRight } from "@wanteddev/wds-icon";
import { use } from "react";

import emptyEventsIllustration from "@/assets/icons/events/empty-events.svg";
import { fetchMyLockerAssignment } from "@/entities/lockers/lockersApi";

interface LockersAssignmentContentProps {
  onViewLocation: () => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-09-05" → "2026.09.05(토)". 시간대에 따라 날짜가 밀리지 않게 문자열을 직접 나눠 읽는다.
function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${date.replaceAll("-", ".")}(${weekday})`;
}

// "2026-09-05T13:59" → "2026.09.05(토) 13:59"
function formatDateTime(value: string) {
  const [date, time] = value.split("T");
  return `${formatDate(date)} ${time}`;
}

// Figma: 사물함 배정 상태 배정완료 (nodeId 3147:148357), 빈 상태 (3147:148331)
// 배정 요약 카드와 배정된 사물함 카드 둘 다 Stream 로컬 카드다(학생회비 납부내역 카드와 같은 틀).
function LockersAssignmentContent({
  onViewLocation,
}: LockersAssignmentContentProps) {
  const assignment = use(fetchMyLockerAssignment());

  if (!assignment) {
    const year = new Date().getFullYear();
    return (
      <div className="flex justify-center pt-50">
        {/* Figma: Empty State (nodeId 3147:148336) — 행사 목록과 같은 그림, 타이틀만 있다 */}
        <div className="flex w-66.75 flex-col items-center gap-3">
          <div className="flex size-20.25 items-center justify-center">
            <img alt="" src={emptyEventsIllustration} />
          </div>
          <Typography
            align="center"
            color="semantic.label.neutral"
            variant="body2"
            weight="bold"
          >
            {year} 사물함 신청내역이 없어요
          </Typography>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "신청일시", value: formatDateTime(assignment.appliedAt) },
    {
      label: "사용기한",
      value: `${formatDate(assignment.usageStartDate)} - ${formatDate(assignment.usageEndDate)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-3 px-5 pb-4">
      <div className="flex flex-col items-start gap-2 rounded-xl bg-background-normal p-4">
        <ContentBadge
          accentColor="semantic.accent.foreground.green"
          color="accent"
          size="small"
          variant="solid"
        >
          배정완료
        </ContentBadge>
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          {assignment.semester} 사물함
        </Typography>
        <div className="flex flex-col gap-1.5">
          {rows.map((row) => (
            <div className="flex gap-2" key={row.label}>
              <Typography
                as="p"
                color="semantic.label.alternative"
                variant="label2"
                weight="regular"
              >
                {row.label}
              </Typography>
              <Typography
                as="p"
                color="semantic.label.neutral"
                variant="label2"
                weight="regular"
              >
                {row.value}
              </Typography>
            </div>
          ))}
        </div>
      </div>

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
