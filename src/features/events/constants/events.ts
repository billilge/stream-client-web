export type EventStatus = "open" | "upcoming" | "closed";

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  status: EventStatus;
  statusLabel: string;
  actionLabel: string;
}

// 모집 상태 필터. value는 EventStatus + "all"이고, 라벨은 Figma Filter Chips(1243:70861) 그대로.
export const EVENT_STATUS_FILTERS = [
  { label: "전체", value: "all" },
  { label: "모집중", value: "open" },
  { label: "모집예정", value: "upcoming" },
  { label: "모집종료", value: "closed" },
] as const;

// Figma: 행사 Event List (nodeId 1243:70866) 순서·문구를 그대로 옮긴 목데이터 — 실 API 연동 전까지 사용.
// Figma는 같은 행사명 4개를 상태만 바꿔 보여주는 목업이라, 상태 3종이 다 나오도록 그대로 뒀다.
export const EVENTS: EventItem[] = [
  {
    actionLabel: "신청하기",
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-open",
    status: "open",
    statusLabel: "신청마감 D-2",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "8월 10일 오픈",
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-upcoming",
    status: "upcoming",
    statusLabel: "모집예정",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "모집종료",
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-closed-1",
    status: "closed",
    statusLabel: "모집종료",
    title: "소프트웨어융합대학 체육대회",
  },
  {
    actionLabel: "모집종료",
    eventDate: "행사일 2026.06.04",
    id: "sw-sports-day-closed-2",
    status: "closed",
    statusLabel: "모집종료",
    title: "소프트웨어융합대학 체육대회",
  },
];
