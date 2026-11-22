import type { CalendarSchedule } from "@/shared/entities/calendars/calendarsTypes";

// 학사 일정은 서버에 API가 없어서 목데이터다. 11월은 Figma 학사일정 상세(5365:90635)의 일정 이름·기간과
// 날짜별 점(16~18일 1개, 19일 2개, 20일 3개, 21~23일 1개)을 따랐다. 20일은 홈 주간 카드(5365:90592)의
// "1건 더보기"가 보이도록 4개를 둔다(점은 3개까지만 그린다). 나머지 달은 달을 옮겨 볼 수 있게 채운 예시다.
// API가 붙으면 이 파일은 사라진다.
export const CALENDARS_SCHEDULES: CalendarSchedule[] = [
  {
    scheduleId: 1,
    title: "2학기 개강",
    startDate: "2026-09-01",
    endDate: "2026-09-01",
  },
  {
    scheduleId: 2,
    title: "수강신청 확인 및 정정",
    startDate: "2026-09-01",
    endDate: "2026-09-07",
  },
  {
    scheduleId: 3,
    title: "2학기 중간고사",
    startDate: "2026-10-19",
    endDate: "2026-10-23",
  },
  {
    scheduleId: 4,
    title: "K-장기 현장실습 신청 기간",
    startDate: "2026-11-16",
    endDate: "2026-11-20",
  },
  {
    scheduleId: 5,
    title: "동계 계절학기 신청",
    startDate: "2026-11-19",
    endDate: "2026-11-23",
  },
  {
    scheduleId: 6,
    title: "학위청구논문 제출 마감",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
  },
  {
    scheduleId: 10,
    title: "2학기 졸업사정 결과 확인",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
  },
  {
    scheduleId: 7,
    title: "2학기 기말고사",
    startDate: "2026-12-14",
    endDate: "2026-12-18",
  },
  {
    scheduleId: 8,
    title: "2학기 종강",
    startDate: "2026-12-18",
    endDate: "2026-12-18",
  },
  {
    scheduleId: 9,
    title: "동계 계절학기",
    startDate: "2026-12-21",
    endDate: "2027-01-15",
  },
];
