import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { api, type CursorSliceResponse, isApiError } from "@/shared/api";
import { eventsKeys } from "@/shared/entities/events/eventsKeys";
import {
  MY_EVENT_APPLICATIONS_MOCK,
  toMockDateTime,
} from "@/shared/entities/events/eventsMock";
import type {
  EventDetail,
  EventListItem,
  EventRecruitStatus,
  MyEventApplication,
} from "@/shared/entities/events/eventsTypes";

// 화면이 갈라 처리하는 서버 에러 코드(EventErrorCode)
export const EVENTS_ERROR_CODES = {
  eventNotFound: "EVENT_NOT_FOUND",
} as const;

// 화면이 빈 상태로 그리는 실패(없는 행사 등)는 null로 돌려준다. 그 밖의 실패는 그대로 던진다.
async function nullOnErrorCode<T>(
  request: Promise<T>,
  codes: readonly string[],
): Promise<T | null> {
  try {
    return await request;
  } catch (error) {
    if (isApiError(error) && codes.includes(error.code)) {
      return null;
    }
    throw error;
  }
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const eventsQueries = {
  // 행사 목록을 커서로 이어 받는다(GET /v1/app/events). recruitStatus가 null이면 거르지 않는다.
  list: (recruitStatus: EventRecruitStatus | null) =>
    infiniteQueryOptions({
      queryKey: eventsKeys.list(recruitStatus),
      queryFn: ({ pageParam, signal }) =>
        api.get<CursorSliceResponse<EventListItem>>("/v1/app/events", {
          // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이, 전체는 recruitStatus 없이 간다
          params: { cursor: pageParam, recruitStatus },
          signal,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : null,
    }),
  // 없는 행사는 null — 상세 화면이 "행사를 찾을 수 없어요" 빈 상태를 그린다.
  detail: (eventId: string) =>
    queryOptions({
      queryKey: eventsKeys.detail(eventId),
      queryFn: ({ signal }) =>
        nullOnErrorCode(
          api.get<EventDetail>(`/v1/app/events/${eventId}`, { signal }),
          [EVENTS_ERROR_CODES.eventNotFound],
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
