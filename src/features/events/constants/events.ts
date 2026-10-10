// 모집 상태 필터. value는 EventStatus + "all"이고, 라벨은 Figma Filter Chips(1243:70861) 그대로.
export const EVENT_STATUS_FILTERS = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "open" },
  { label: "모집예정", value: "upcoming" },
  { label: "모집종료", value: "closed" },
] as const;

// 행사 목록의 행사/신청내역 탭은 경로로 나눈다 — 새로고침·뒤로가기에도 탭이 유지되고,
// 신청 완료 화면처럼 다른 화면에서도 신청내역 탭으로 바로 보낼 수 있다.
export const EVENTS_TAB_PATHS = {
  application: "/events/applications",
  event: "/events",
} as const;

export type EventsTab = keyof typeof EVENTS_TAB_PATHS;
