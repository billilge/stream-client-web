import type { EventListItem } from "@/shared/entities/events/eventsTypes";

// 행사 화면은 실 API로 받는다. 이 목록은 아직 목데이터로 도는 검색(searchQueries)만 쓴다 — 검색 API를 붙일 때 지운다.
// 행사 목록 응답(EventListItem) 모양이고, Figma 행사 Event List(1243:70866)처럼 같은 행사명에 모집 상태만 다르다.
export const EVENTS: EventListItem[] = [
  {
    applyEndAt: "2026-06-03T23:59:00",
    applyStartAt: "2026-05-25T10:00:00",
    daysUntilDeadline: 2,
    eventId: 1,
    eventStartAt: "2026-06-04T18:30:00",
    recruitStatus: "OPEN",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
  {
    applyEndAt: "2026-06-03T23:59:00",
    applyStartAt: "2026-05-25T10:00:00",
    daysUntilDeadline: null,
    eventId: 2,
    eventStartAt: "2026-06-04T18:30:00",
    recruitStatus: "CLOSED",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
  {
    applyEndAt: "2026-08-20T23:59:00",
    applyStartAt: "2026-08-10T10:00:00",
    daysUntilDeadline: null,
    eventId: 3,
    eventStartAt: "2026-08-28T18:30:00",
    recruitStatus: "BEFORE_OPEN",
    thumbnailUrl: null,
    title: "소프트웨어융합대학 체육대회",
  },
];
