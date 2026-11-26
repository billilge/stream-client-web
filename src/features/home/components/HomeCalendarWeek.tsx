import { useSuspenseQuery } from "@tanstack/react-query";
import { Typography } from "@wanteddev/wds";

import CalendarsDateGrid from "@/features/calendars/components/CalendarsDateGrid";
import { formatSchedulePeriod } from "@/features/calendars/utils/calendarDates";
import {
  countSchedulesByDate,
  getSchedulesOn,
} from "@/features/calendars/utils/calendarSchedules";
import { calendarsQueries } from "@/shared/entities/calendars/calendarsQueries";

// 일정 카드는 3개까지 보이고 나머지는 "N건 더보기"로 넘긴다
const VISIBLE_SCHEDULE_LIMIT = 3;

interface HomeCalendarWeekProps {
  weekDates: string[];
  today: string;
  selectedDate: string;
  onSelect: (date: string) => void;
  /** N건 더보기 → 고른 날짜로 학사 일정 상세 */
  onMore: (date: string) => void;
}

// 카드의 세로 간격(12px)에 바로 들어가도록 감싸지 않고 돌려준다.
function HomeCalendarWeek({
  weekDates,
  today,
  selectedDate,
  onSelect,
  onMore,
}: HomeCalendarWeekProps) {
  const { data: schedules } = useSuspenseQuery(
    calendarsQueries.schedules(weekDates[0], weekDates[weekDates.length - 1]),
  );
  const daySchedules = getSchedulesOn(schedules, selectedDate);
  const hiddenCount = daySchedules.length - VISIBLE_SCHEDULE_LIMIT;

  return (
    <>
      <CalendarsDateGrid
        onSelect={onSelect}
        scheduleCounts={countSchedulesByDate(schedules, weekDates)}
        selectedDate={selectedDate}
        size="weekly"
        today={today}
        weeks={[weekDates]}
      />
      {daySchedules.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {daySchedules.slice(0, VISIBLE_SCHEDULE_LIMIT).map((schedule) => (
            <li
              className="flex items-center justify-between gap-2 rounded-xl border border-line-normal-neutral p-3"
              key={schedule.scheduleId}
            >
              {/* 한 줄 카드라 긴 제목은 기간을 밀어내지 않게 말줄임한다 */}
              <Typography
                as="p"
                className="min-w-0 truncate"
                color="semantic.label.normal"
                variant="label2"
                weight="bold"
              >
                {schedule.title}
              </Typography>
              <Typography
                as="p"
                className="shrink-0"
                color="semantic.label.alternative"
                variant="caption1"
                weight="regular"
              >
                {formatSchedulePeriod(schedule.startDate, schedule.endDate)}
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        // 일정이 없는 날은 Figma에 없어서 학사 일정 상세의 빈 상태 문구만 작게 둔다
        <Typography
          align="center"
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          선택한 날짜의 일정이 없어요
        </Typography>
      )}
      {hiddenCount > 0 && (
        <button onClick={() => onMore(selectedDate)} type="button">
          <Typography
            align="center"
            as="span"
            color="semantic.primary.normal"
            display="block"
            variant="label1"
            weight="regular"
          >
            {hiddenCount}건 더보기
          </Typography>
        </button>
      )}
    </>
  );
}

export default HomeCalendarWeek;
