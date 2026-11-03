import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api, type CursorSliceResponse, isApiError } from "@/shared/api";
import { eventsKeys } from "@/shared/entities/events/eventsKeys";
import type {
  EventApplyAnswer,
  EventApplyResult,
  EventDetail,
  EventForm,
  EventListItem,
  EventRecruitStatus,
  MyEventApplicationDetail,
  MyEventApplicationListItem,
} from "@/shared/entities/events/eventsTypes";

// 화면이 갈라 처리하는 서버 에러 코드(EventErrorCode)
export const EVENTS_ERROR_CODES = {
  alreadyApplied: "ALREADY_APPLIED",
  alreadyCanceled: "ALREADY_CANCELED",
  // 신청 기간이 끝났다
  alreadyClosed: "ALREADY_CLOSED",
  applicationNotFound: "APPLICATION_NOT_FOUND",
  // 신청 기간이 끝나 취소할 수 없다
  cancelDeadlinePassed: "CANCEL_DEADLINE_PASSED",
  // 선착순 정원이 다 찼다
  capacityFull: "CAPACITY_FULL",
  eventNotFound: "EVENT_NOT_FOUND",
} as const;

// 더 신청할 수 없는 행사 — 신청서 양식 조회·신청이 이 코드로 실패하면 마감 화면으로 보낸다
export const EVENTS_CLOSED_ERROR_CODES: readonly string[] = [
  EVENTS_ERROR_CODES.alreadyClosed,
  EVENTS_ERROR_CODES.capacityFull,
];

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

// 커서 목록의 다음 페이지 — 마지막 페이지면 null이라 더 받지 않는다
function getNextCursor(lastPage: CursorSliceResponse<unknown>) {
  return lastPage.hasNext ? lastPage.nextCursor : null;
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
      getNextPageParam: getNextCursor,
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
  // 신청서 양식(GET /v1/app/events/{eventId}/form). 마감된 행사는 null — 신청서 화면이 마감 화면으로 보낸다.
  form: (eventId: string) =>
    queryOptions({
      queryKey: eventsKeys.form(eventId),
      queryFn: ({ signal }) =>
        nullOnErrorCode(
          api.get<EventForm>(`/v1/app/events/${eventId}/form`, { signal }),
          EVENTS_CLOSED_ERROR_CODES,
        ),
    }),
  // 내 신청내역을 커서로 이어 받는다(GET /v1/app/events/applications)
  applications: () =>
    infiniteQueryOptions({
      queryKey: eventsKeys.applications(),
      queryFn: ({ pageParam, signal }) =>
        api.get<CursorSliceResponse<MyEventApplicationListItem>>(
          "/v1/app/events/applications",
          { params: { cursor: pageParam }, signal },
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 없는 신청내역(행사가 지워진 경우 포함)은 null — 상세 화면이 신청내역 목록으로 돌려보낸다
  application: (applicationId: string) =>
    queryOptions({
      queryKey: eventsKeys.application(applicationId),
      queryFn: ({ signal }) =>
        nullOnErrorCode(
          api.get<MyEventApplicationDetail>(
            `/v1/app/events/applications/${applicationId}`,
            { signal },
          ),
          [
            EVENTS_ERROR_CODES.applicationNotFound,
            EVENTS_ERROR_CODES.eventNotFound,
          ],
        ),
    }),
};

// 행사 신청(POST /v1/app/events/{eventId}/applications). 신청이 생기고 정원이 차서 모집 상태가 바뀔 수도 있어서
// 신청내역과 행사 목록·상세를 무효화한다. 마감·이미 신청으로 실패해도 지금 캐시가 낡았다는 뜻이라 같이 무효화한다.
// 신청서 양식은 무효화하지 않는다 — 신청서 화면이 떠 있는 동안 다시 받으면 마감된 양식이 화면을 마감으로 보낸다.
export function useApplyEventMutation(eventId: string) {
  const queryClient = useQueryClient();
  const invalidateApplyTargets = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: eventsKeys.applications() }),
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(eventId) }),
    ]);

  return useMutation({
    mutationFn: (answers: EventApplyAnswer[]) =>
      api.post<EventApplyResult>(`/v1/app/events/${eventId}/applications`, {
        answers,
      }),
    // 신청서 화면은 바로 완료 화면으로 넘어가서 다시 받을 조회가 화면에 없다 — 낡은 표시만 하고 금방 끝난다
    onSuccess: invalidateApplyTargets,
    onError: (error) => {
      if (
        isApiError(error) &&
        (EVENTS_CLOSED_ERROR_CODES.includes(error.code) ||
          error.code === EVENTS_ERROR_CODES.alreadyApplied)
      ) {
        return invalidateApplyTargets();
      }
    },
  });
}

// 신청 취소(PATCH /v1/app/events/applications/{applicationId}/cancel). 신청 기록은 남고 상태만 취소로 바뀐다.
// 성공하면 신청내역 목록·상세를 다시 받아 취소 상태를 보여 준다. 이미 취소된 신청이었다면 지금 캐시가 낡았다는
// 뜻이라 똑같이 다시 받는다.
export function useCancelEventApplicationMutation() {
  const queryClient = useQueryClient();
  // Promise를 돌려줘서 다시 받은 데이터가 들어온 뒤에 mutation이 끝나게 한다 —
  // 화면은 끝난 뒤 토스트를 띄우므로 토스트가 취소된 화면과 함께 뜬다.
  const refetchApplications = () =>
    Promise.all([
      // 목록·상세를 모두 낡은 것으로 표시하고, 지금 화면에 있는 조회(취소한 상세)만 바로 다시 받는다
      queryClient.invalidateQueries({ queryKey: eventsKeys.applications() }),
      // 목록은 화면에 없어도 다시 받는다 — 안 그러면 목록으로 돌아갔을 때 취소 전 캐시가 잠깐 보였다가 바뀐다.
      // 열어 봤던 다른 상세는 취소와 상관없어 다시 받지 않는다
      queryClient.refetchQueries({
        exact: true,
        queryKey: eventsKeys.applications(),
      }),
    ]);

  return useMutation({
    mutationFn: (applicationId: string) =>
      api.patch<null>(`/v1/app/events/applications/${applicationId}/cancel`),
    onSuccess: refetchApplications,
    onError: (error) => {
      if (
        isApiError(error) &&
        error.code === EVENTS_ERROR_CODES.alreadyCanceled
      ) {
        return refetchApplications();
      }
    },
  });
}
