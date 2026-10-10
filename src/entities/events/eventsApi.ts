import {
  EVENTS,
  MY_EVENT_APPLICATIONS_MOCK,
} from "@/entities/events/eventsMock";
import type { EventItem, MyEventApplication } from "@/entities/events/types";
import {
  invalidateMockupApi,
  mockupApi,
  mockupMutation,
} from "@/lib/mockupApi";

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

// "2026-06-04T13:00" — 목데이터의 일시 형식(분 단위, 현지 시각)
function toLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const MY_APPLICATIONS_KEY = "events/applications";

export function fetchMyEventApplications(): Promise<MyEventApplication[]> {
  return mockupApi(MY_APPLICATIONS_KEY, () => [...MY_EVENT_APPLICATIONS_MOCK]);
}

// 없는 신청내역은 null
export function fetchMyEventApplication(
  applicationId: string,
): Promise<MyEventApplication | null> {
  return mockupApi(
    `${MY_APPLICATIONS_KEY}/${applicationId}`,
    () =>
      MY_EVENT_APPLICATIONS_MOCK.find(
        (application) => application.id === applicationId,
      ) ?? null,
  );
}

// 신청을 취소하고 바뀐 신청내역을 돌려준다. 목록·상세 조회 캐시를 지워 다음 조회가 취소 상태를 받게 한다.
export async function cancelMyEventApplication(
  applicationId: string,
): Promise<MyEventApplication> {
  const cancelled = await mockupMutation(() => {
    const index = MY_EVENT_APPLICATIONS_MOCK.findIndex(
      (application) => application.id === applicationId,
    );
    if (index === -1) {
      throw new Error(`신청내역을 찾을 수 없어요: ${applicationId}`);
    }
    const next: MyEventApplication = {
      ...MY_EVENT_APPLICATIONS_MOCK[index],
      // 실 API에서는 서버가 취소 시각을 정해 돌려준다
      cancelledAt: toLocalDateTime(new Date()),
      status: "cancelled",
    };
    MY_EVENT_APPLICATIONS_MOCK[index] = next;
    return next;
  });
  invalidateMockupApi([
    MY_APPLICATIONS_KEY,
    `${MY_APPLICATIONS_KEY}/${applicationId}`,
  ]);
  return cancelled;
}
