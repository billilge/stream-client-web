import type { CalendarSchedule } from "@/shared/entities/calendars/calendarsTypes";

// 날짜 문자열("2026-11-19")은 사전 순서가 날짜 순서와 같아서 그대로 비교한다
export function getSchedulesOn(schedules: CalendarSchedule[], date: string) {
  return schedules.filter(
    (schedule) => schedule.startDate <= date && date <= schedule.endDate,
  );
}

export function countSchedulesByDate(
  schedules: CalendarSchedule[],
  dates: string[],
) {
  return new Map(
    dates.map((date) => [date, getSchedulesOn(schedules, date).length]),
  );
}
