import { WEEKDAYS } from "@/lib/date";

// 날짜는 "2026-11-19" 문자열로 주고받고 계산할 때만 기기 시간대의 자정 Date로 바꾼다 —
// new Date("2026-11-19")는 UTC로 읽혀서 시간대에 따라 하루가 밀린다.

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateString(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getToday() {
  return toDateString(new Date());
}

// "2026-02-30"처럼 없는 날짜는 Date가 다음 달로 넘겨서 되돌리면 달라진다
export function isDateString(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    toDateString(parseDate(value)) === value
  );
}

export function addDays(value: string, days: number) {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

export function getWeekday(value: string) {
  return parseDate(value).getDay();
}

// 달력은 일요일부터 시작한다
export function getWeekStart(value: string) {
  return addDays(value, -getWeekday(value));
}

export function getWeekDates(weekStart: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function getMonthStart(value: string) {
  return `${value.slice(0, 7)}-01`;
}

export function addMonths(monthStart: string, months: number) {
  const date = parseDate(monthStart);
  return toDateString(
    new Date(date.getFullYear(), date.getMonth() + months, 1),
  );
}

export function isSameMonth(a: string, b: string) {
  return a.slice(0, 7) === b.slice(0, 7);
}

// 1일이 든 주의 일요일부터 말일이 든 주의 토요일까지라 달에 따라 4~6주다
export function getMonthWeeks(monthStart: string) {
  const start = parseDate(monthStart);
  const lastDate = toDateString(
    new Date(start.getFullYear(), start.getMonth() + 1, 0),
  );
  const weeks: string[][] = [];
  for (
    let weekStart = getWeekStart(monthStart);
    weekStart <= lastDate;
    weekStart = addDays(weekStart, 7)
  ) {
    weeks.push(getWeekDates(weekStart));
  }
  return weeks;
}

// "11.15 – 11.21"
export function formatWeekRange(weekStart: string) {
  const [start, end] = [weekStart, addDays(weekStart, 6)].map(parseDate);
  return `${start.getMonth() + 1}.${start.getDate()} – ${end.getMonth() + 1}.${end.getDate()}`;
}

// "2026년 11월"
export function formatYearMonth(value: string) {
  const date = parseDate(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

// "11월 19일 목요일"
export function formatSelectedDate(value: string) {
  const date = parseDate(value);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${WEEKDAYS[date.getDay()]}요일`;
}

function formatScheduleDate(value: string) {
  const date = parseDate(value);
  return `${date.getMonth() + 1}.${date.getDate()} (${WEEKDAYS[date.getDay()]})`;
}

// "11.16 (월) – 11.20 (금)", 하루짜리 일정은 "11.20 (금)"
export function formatSchedulePeriod(startDate: string, endDate: string) {
  return startDate === endDate
    ? formatScheduleDate(startDate)
    : `${formatScheduleDate(startDate)} – ${formatScheduleDate(endDate)}`;
}
