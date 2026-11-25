import { Typography } from "@wanteddev/wds";

import {
  formatSelectedDate,
  getWeekday,
} from "@/features/calendars/utils/calendarDates";

export type CalendarsDateSize = "weekly" | "monthly";

// 점은 Figma "일정 표시 · 고정 영역"(16×5)처럼 3개까지만 그린다. 모양이 모두 같아서 자리마다 고정 key를 둔다
const SCHEDULE_DOT_KEYS = ["dot-1", "dot-2", "dot-3"];

// Figma Calendar/Weekly Date(37×48, 위 8px)·Calendar/Date(47×52, 위 10px). 폭은 달력 grid 칸이 정한다
const SIZE_CLASS_NAMES = {
  weekly: "h-12 pt-2",
  monthly: "h-13 pt-2.5",
} satisfies Record<CalendarsDateSize, string>;

interface CalendarsDateCellProps {
  date: string;
  size: CalendarsDateSize;
  scheduleCount: number;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth: boolean;
  onSelect: (date: string) => void;
}

function getDateColor({
  date,
  isToday,
  isSelected,
  isOutsideMonth,
}: Pick<
  CalendarsDateCellProps,
  "date" | "isToday" | "isSelected" | "isOutsideMonth"
>) {
  if (isToday) {
    return "semantic.static.white";
  }
  if (isSelected) {
    return "semantic.primary.normal";
  }
  // Figma는 다음 달 날짜도 토요일(12월 5일)은 파란색이라 주말 색을 앞뒤 달 흐림보다 먼저 본다
  const weekday = getWeekday(date);
  if (weekday === 0) {
    return "semantic.accent.foreground.red";
  }
  if (weekday === 6) {
    return "semantic.accent.foreground.blue";
  }
  return isOutsideMonth ? "semantic.label.assistive" : "semantic.label.normal";
}

// Figma: Calendar/Weekly Date (홈 주간, nodeId 5164:37733), Calendar/Date (학사일정 상세, 5148:38244)
// 두 컴포넌트는 크기만 다르고 상태가 같아서 size로 나눈다.
// 라운드는 Figma 10px인데 Tailwind 단계가 8px(lg)·12px(xl)뿐이라 임의값으로 둔다.
function CalendarsDateCell({
  date,
  size,
  scheduleCount,
  isToday,
  isSelected,
  isOutsideMonth,
  onSelect,
}: CalendarsDateCellProps) {
  const background = isToday
    ? "bg-primary"
    : isSelected
      ? "bg-primary-subtle"
      : "";

  return (
    <button
      aria-current={isToday ? "date" : undefined}
      aria-label={
        scheduleCount > 0
          ? `${formatSelectedDate(date)}, 일정 ${scheduleCount}개`
          : formatSelectedDate(date)
      }
      aria-pressed={isSelected}
      className={`flex flex-col items-center gap-1.5 rounded-[10px] ${SIZE_CLASS_NAMES[size]} ${background}`}
      onClick={() => onSelect(date)}
      type="button"
    >
      <Typography
        as="span"
        color={getDateColor({ date, isOutsideMonth, isSelected, isToday })}
        variant="label1"
        weight="bold"
      >
        {Number(date.slice(8))}
      </Typography>
      {/* 점이 없어도 자리를 지켜서 날짜 숫자 위치가 칸마다 같다 */}
      <span aria-hidden="true" className="flex h-1.25 items-center gap-0.5">
        {SCHEDULE_DOT_KEYS.slice(0, scheduleCount).map((key) => (
          <span
            className={`size-1 rounded-full ${isToday ? "bg-static-white" : "bg-primary"}`}
            key={key}
          />
        ))}
      </span>
    </button>
  );
}

export default CalendarsDateCell;
