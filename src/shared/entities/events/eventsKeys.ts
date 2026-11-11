import type { EventRecruitStatus } from "@/shared/entities/events/eventsTypes";

// 조회 캐시 key. 조회와 무효화가 같은 함수로 key를 만들어서, 한쪽만 바뀌어 무효화가 빗나가지 않게 한다.
// 행사 목록은 모집 상태 필터·검색어마다 따로 받아서 lists() 아래에 둔다 — lists() 하나로 모든 필터를 같이 무효화한다.
// 신청내역 상세는 목록 key 아래에 둬서, 목록 key 하나로 목록·상세를 같이 무효화한다.
// 행사 상세는 details() 아래에 둔다 — 신청 취소는 어느 행사인지 받지 않아서 모든 상세를 같이 무효화한다.
export const eventsKeys = {
  root: () => ["events"] as const,
  lists: () => [...eventsKeys.root(), "list"] as const,
  list: (recruitStatus: EventRecruitStatus | null, keyword: string | null) =>
    [...eventsKeys.lists(), recruitStatus, keyword] as const,
  details: () => [...eventsKeys.root(), "detail"] as const,
  detail: (eventId: string) => [...eventsKeys.details(), eventId] as const,
  form: (eventId: string) => [...eventsKeys.root(), "form", eventId] as const,
  applications: () => [...eventsKeys.root(), "applications"] as const,
  application: (applicationId: string) =>
    [...eventsKeys.applications(), applicationId] as const,
};
