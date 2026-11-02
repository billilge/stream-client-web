import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  EVENTS,
  MY_EVENT_APPLICATIONS_MOCK,
  toMockDateTime,
} from "@/entities/events/eventsMock";
import type { MyEventApplication } from "@/entities/events/types";
import { mockupResponse } from "@/lib/mockupApi";

// 조회 캐시 key. 조회와 무효화가 같은 함수로 key를 만들어서, 한쪽만 바뀌어 무효화가 빗나가지 않게 한다.
// 신청내역 상세는 목록 key 아래에 둬서, 목록 key 하나로 목록·상세를 같이 무효화한다.
const eventsKeys = {
  root: () => ["events"] as const,
  list: () => [...eventsKeys.root(), "list"] as const,
  detail: (eventId: string) =>
    [...eventsKeys.root(), "detail", eventId] as const,
  applications: () => [...eventsKeys.root(), "applications"] as const,
  application: (applicationId: string) =>
    [...eventsKeys.applications(), applicationId] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const eventsQueries = {
  list: () =>
    queryOptions({
      queryKey: eventsKeys.list(),
      queryFn: () => mockupResponse(() => EVENTS),
    }),
  // 없는 행사는 null — 상세 화면이 "행사를 찾을 수 없어요" 빈 상태를 그린다.
  detail: (eventId: string) =>
    queryOptions({
      queryKey: eventsKeys.detail(eventId),
      queryFn: () =>
        mockupResponse(
          () => EVENTS.find((event) => event.id === eventId) ?? null,
        ),
    }),
  applications: () =>
    queryOptions({
      queryKey: eventsKeys.applications(),
      queryFn: () => mockupResponse(() => [...MY_EVENT_APPLICATIONS_MOCK]),
    }),
  // 없는 신청내역은 null
  application: (applicationId: string) =>
    queryOptions({
      queryKey: eventsKeys.application(applicationId),
      queryFn: () =>
        mockupResponse(
          () =>
            MY_EVENT_APPLICATIONS_MOCK.find(
              (application) => application.id === applicationId,
            ) ?? null,
        ),
    }),
};

// 신청을 취소하고 바뀐 신청내역을 돌려준다. 성공하면 신청내역 목록·상세 캐시를 무효화해 취소 상태를 다시 받는다.
export function useCancelEventApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) =>
      mockupResponse(() => {
        const index = MY_EVENT_APPLICATIONS_MOCK.findIndex(
          (application) => application.id === applicationId,
        );
        if (index === -1) {
          throw new Error(`신청내역을 찾을 수 없어요: ${applicationId}`);
        }
        const next: MyEventApplication = {
          ...MY_EVENT_APPLICATIONS_MOCK[index],
          // 실 API에서는 서버가 취소 시각을 정해 돌려준다
          cancelledAt: toMockDateTime(new Date()),
          status: "cancelled",
        };
        MY_EVENT_APPLICATIONS_MOCK[index] = next;
        return next;
      }),
    // Promise를 돌려줘서 다시 받은 데이터가 들어온 뒤에 mutation이 끝나게 한다 —
    // 화면은 끝난 뒤 토스트를 띄우므로 토스트가 취소된 화면과 함께 뜬다.
    onSuccess: () =>
      Promise.all([
        // 목록·상세를 모두 낡은 것으로 표시하고, 지금 화면에 있는 조회(취소한 상세)만 바로 다시 받는다
        queryClient.invalidateQueries({ queryKey: eventsKeys.applications() }),
        // 목록은 화면에 없어도 다시 받는다 — 안 그러면 목록으로 돌아갔을 때 취소 전 캐시가 잠깐 보였다가 바뀐다.
        // 열어 봤던 다른 상세는 취소와 상관없어 다시 받지 않는다
        queryClient.refetchQueries({
          exact: true,
          queryKey: eventsKeys.applications(),
        }),
      ]),
  });
}
