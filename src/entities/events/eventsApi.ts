import { EVENTS } from "@/entities/events/eventsMock";
import type { EventItem } from "@/entities/events/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchEvents(): Promise<EventItem[]> {
  return mockupApi("events", () => EVENTS);
}

// 없는 행사는 null — 상세 화면이 "행사를 찾을 수 없어요" 빈 상태를 그린다.
export function fetchEvent(eventId: string): Promise<EventItem | null> {
  return mockupApi(
    `events/${eventId}`,
    () => EVENTS.find((event) => event.id === eventId) ?? null,
  );
}
