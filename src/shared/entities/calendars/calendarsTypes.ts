// 날짜는 "2026-11-19" 형식이고, 하루짜리 일정은 시작일과 종료일이 같다. 서버 API가 정해지면 응답에 맞춘다.
export interface CalendarSchedule {
  scheduleId: number;
  title: string;
  startDate: string;
  endDate: string;
}
