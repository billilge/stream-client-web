import { useSuspenseQuery } from "@tanstack/react-query";
import { Typography } from "@wanteddev/wds";

import emptyCalendar from "@/assets/icons/common/empty-calendar.svg";
import CalendarsDateGrid from "@/features/calendars/components/CalendarsDateGrid";
import CalendarsScheduleRow from "@/features/calendars/components/CalendarsScheduleRow";
import { formatSelectedDate } from "@/features/calendars/utils/calendarDates";
import {
  countSchedulesByDate,
  getSchedulesOn,
} from "@/features/calendars/utils/calendarSchedules";
import { calendarsQueries } from "@/shared/entities/calendars/calendarsQueries";

interface CalendarsMonthContentProps {
  monthStart: string;
  weeks: string[][];
  today: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}

// Figma: 학사일정 상세 (nodeId 5365:90635), 일정 없음 (5365:90711)
// 화면의 세로 간격(20px)에 바로 들어가도록 달력·회색 띠·일정 목록을 감싸지 않고 돌려준다.
function CalendarsMonthContent({
  monthStart,
  weeks,
  today,
  selectedDate,
  onSelect,
}: CalendarsMonthContentProps) {
  const dates = weeks.flat();
  const { data: schedules } = useSuspenseQuery(
    calendarsQueries.schedules(dates[0], dates[dates.length - 1]),
  );
  const daySchedules = getSchedulesOn(schedules, selectedDate);

  return (
    <>
      <div className="px-5">
        <CalendarsDateGrid
          monthStart={monthStart}
          onSelect={onSelect}
          scheduleCounts={countSchedulesByDate(schedules, dates)}
          selectedDate={selectedDate}
          size="monthly"
          today={today}
          weeks={weeks}
        />
      </div>
      <div className="h-2 w-full shrink-0 bg-background-alternative" />
      <section
        aria-label={`${formatSelectedDate(selectedDate)} 일정`}
        className="flex flex-col gap-3 px-5"
      >
        <div className="flex items-center justify-between">
          <Typography
            as="h3"
            color="semantic.label.neutral"
            variant="label1"
            weight="medium"
          >
            {formatSelectedDate(selectedDate)}
          </Typography>
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            일정 {daySchedules.length}개
          </Typography>
        </div>
        {daySchedules.length > 0 ? (
          daySchedules.map((schedule) => (
            <CalendarsScheduleRow
              key={schedule.scheduleId}
              schedule={schedule}
            />
          ))
        ) : (
          // 그림은 빌릴게 대여 내역 빈 상태와 같은 그림이라 같은 SVG를 쓴다
          <div className="flex flex-col items-center gap-1 py-5">
            <div className="flex size-16 items-center justify-center">
              <img alt="" src={emptyCalendar} />
            </div>
            <Typography
              align="center"
              as="p"
              color="semantic.label.alternative"
              variant="caption1"
              weight="medium"
            >
              선택한 날짜의 일정이 없어요
            </Typography>
          </div>
        )}
      </section>
    </>
  );
}

export default CalendarsMonthContent;
