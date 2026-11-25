import { Typography } from "@wanteddev/wds";

import CalendarsDateCell, {
  type CalendarsDateSize,
} from "@/features/calendars/components/CalendarsDateCell";
import { isSameMonth } from "@/features/calendars/utils/calendarDates";
import { WEEKDAYS } from "@/lib/date";

const WEEKDAY_COLORS = [
  "semantic.accent.foreground.red",
  ...Array.from({ length: 5 }, () => "semantic.label.alternative" as const),
  "semantic.accent.foreground.blue",
] as const;

const COLUMN_CLASS_NAMES = {
  weekly: "gap-x-1.5 px-1",
  monthly: "gap-x-px",
} satisfies Record<CalendarsDateSize, string>;

interface CalendarsDateGridProps {
  size: CalendarsDateSize;
  /** 주마다 일요일부터 7일 */
  weeks: string[][];
  today: string;
  selectedDate: string;
  /** 월간만 넘긴다 — 앞뒤 달 날짜를 흐리게 그린다 */
  monthStart?: string;
  /** 일정을 받는 동안(스켈레톤)은 없어서 점을 그리지 않는다 */
  scheduleCounts?: Map<string, number>;
  onSelect: (date: string) => void;
}

// Figma: 학사일정 · 주간의 달력 (nodeId 5365:90600), 학사일정 상세의 달력 (5365:90647)
// 월간은 Figma가 6주 높이(364px)로 고정해 두어서, 달마다 주 수가 달라도 아래 선택 날짜 영역이 움직이지 않는다.
function CalendarsDateGrid({
  size,
  weeks,
  today,
  selectedDate,
  monthStart,
  scheduleCounts,
  onSelect,
}: CalendarsDateGridProps) {
  const columnClassName = `grid grid-cols-7 ${COLUMN_CLASS_NAMES[size]}`;

  return (
    <div
      className={`flex w-full flex-col gap-1.5 ${size === "monthly" ? "h-91" : ""}`}
    >
      <div aria-hidden="true" className={columnClassName}>
        {WEEKDAYS.map((weekday, index) => (
          <Typography
            align="center"
            as="span"
            color={WEEKDAY_COLORS[index]}
            key={weekday}
            variant="caption1"
            weight="medium"
          >
            {weekday}
          </Typography>
        ))}
      </div>
      {weeks.map((week) => (
        <div className={columnClassName} key={week[0]}>
          {week.map((date) => (
            <CalendarsDateCell
              date={date}
              isOutsideMonth={
                monthStart !== undefined && !isSameMonth(date, monthStart)
              }
              isSelected={date === selectedDate}
              isToday={date === today}
              key={date}
              onSelect={onSelect}
              scheduleCount={scheduleCounts?.get(date) ?? 0}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default CalendarsDateGrid;
