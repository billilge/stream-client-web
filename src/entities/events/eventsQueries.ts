import { queryOptions } from "@tanstack/react-query";

import { fetchEvent, fetchEvents } from "@/entities/events/eventsApi";

// 쿼리 키와 요청 함수를 한곳에 묶어 둔다. 화면은 useSuspenseQuery(eventsQueries.list())처럼 쓴다.
export const eventsQueries = {
  detail: (eventId: string) =>
    queryOptions({
      queryFn: () => fetchEvent(eventId),
      queryKey: ["events", eventId],
    }),
  list: () =>
    queryOptions({
      queryFn: fetchEvents,
      queryKey: ["events"],
    }),
};
