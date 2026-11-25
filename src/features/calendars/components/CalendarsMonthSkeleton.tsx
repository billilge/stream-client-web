import { Skeleton, Typography } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";
import CalendarsDateGrid from "@/features/calendars/components/CalendarsDateGrid";
import { formatSelectedDate } from "@/features/calendars/utils/calendarDates";

const ROW_KEYS = ["schedule-1", "schedule-2"];

interface CalendarsMonthSkeletonProps {
  monthStart: string;
  weeks: string[][];
  today: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}

// 날짜는 일정과 상관없어서 달력은 점 없이 그대로 그리고(받는 동안에도 날짜를 고를 수 있다), 일정 자리만 Skeleton으로 채운다.
function CalendarsMonthSkeleton({
  monthStart,
  weeks,
  today,
  selectedDate,
  onSelect,
}: CalendarsMonthSkeletonProps) {
  const animation = useSkeletonAnimation();

  return (
    <>
      <div className="px-5">
        <CalendarsDateGrid
          monthStart={monthStart}
          onSelect={onSelect}
          selectedDate={selectedDate}
          size="monthly"
          today={today}
          weeks={weeks}
        />
      </div>
      <div className="h-2 w-full shrink-0 bg-background-alternative" />
      <div className="flex flex-col gap-3 px-5">
        <div className="flex items-center justify-between">
          <Typography
            as="p"
            color="semantic.label.neutral"
            variant="label1"
            weight="medium"
          >
            {formatSelectedDate(selectedDate)}
          </Typography>
          <Skeleton
            animation={animation}
            height="18px"
            radius="4px"
            variant="rectangle"
            width="44px"
          />
        </div>
        {ROW_KEYS.map((key) => (
          <div className="flex flex-col gap-1.5 py-1 pl-3.75" key={key}>
            <Skeleton
              animation={animation}
              height="18px"
              radius="4px"
              variant="rectangle"
              width="55%"
            />
            <Skeleton
              animation={animation}
              height="14px"
              radius="4px"
              variant="rectangle"
              width="35%"
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default CalendarsMonthSkeleton;
