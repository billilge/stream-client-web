import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api, type CursorSliceResponse, isApiError } from "@/shared/api";
import { eventsKeys } from "@/shared/entities/events/eventsKeys";
import type {
  EventApplyAnswer,
  EventRecruitStatus,
} from "@/shared/entities/events/eventsTypes";
import { homeKeys } from "@/shared/entities/home/homeKeys";

// 서버 enum(RecruitStatus·RecruitType·QuestionType·EventApplicationStatus) 값 — 타입은 eventsTypes.ts가 여기서 만든다
export const EVENT_RECRUIT_STATUSES = [
  "BEFORE_OPEN",
  "OPEN",
  "CLOSED",
] as const;

export const EVENT_RECRUIT_TYPES = ["FIRST_COME", "OPEN"] as const;

export const EVENT_QUESTION_TYPES = [
  "SHORT_TEXT",
  "LONG_TEXT",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
] as const;

export const EVENT_APPLICATION_STATUSES = ["APPLIED", "CANCELED"] as const;

// 서버 응답 검사 — 서버가 필드를 더 보내도 깨지지 않게 looseObject로 두고, 빠지거나 타입이 바뀌면 여기서 실패한다.
// 일시는 서버 LocalDateTime 문자열("2026-06-04T18:30:00", 소수 초가 붙을 수 있다)이다.
export const eventListItemSchema = z.looseObject({
  eventId: z.number(),
  title: z.string(),
  eventStartAt: z.string(),
  thumbnailUrl: z.string().nullable(),
  applyStartAt: z.string(),
  applyEndAt: z.string(),
  recruitStatus: z.enum(EVENT_RECRUIT_STATUSES),
  // 신청 마감일까지 남은 날 수(0이면 오늘 마감). 모집중일 때만 있다
  daysUntilDeadline: z.number().nullable(),
});

const eventListPageSchema = z.looseObject({
  content: z.array(eventListItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullable(),
});

export const eventDetailSchema = z.looseObject({
  eventId: z.number(),
  title: z.string(),
  // 본문. 줄바꿈을 그대로 살려 렌더링한다
  description: z.string(),
  // 장소는 운영진 입력에서 선택 항목이라 없으면 null이다 — 화면은 장소 줄을 뺀다(양식·신청 결과·신청 상세도 같다)
  place: z.string().nullable(),
  eventStartAt: z.string(),
  // 종료 일시를 받기 전에 만든 행사는 null이다(서버 EventPeriod). 상세 "일시"는 있을 때만 "~ 끝 일시"를 붙인다
  eventEndAt: z.string().nullable(),
  applyStartAt: z.string(),
  applyEndAt: z.string(),
  recruitStatus: z.enum(EVENT_RECRUIT_STATUSES),
  daysUntilDeadline: z.number().nullable(),
  images: z.array(z.looseObject({ fileId: z.number(), fileUrl: z.string() })),
  // 신청 조건. 상세 "대상" 문구는 서버가 만들지 않고 이 값들로 프론트가 조합한다.
  feePaidOnly: z.boolean(),
  recruitType: z.enum(EVENT_RECRUIT_TYPES),
  // 선착순일 때만 있다
  capacity: z.number().nullable(),
  // 이 학생이 학생회비 조건을 채우는지. 납부자 전용이 아니면 항상 true, 납부자 전용이면 납부자 명부에 있을 때만 true다.
  // 모집 기간·정원은 반영하지 않아서 recruitStatus와 같이 본다
  isFeeEligible: z.boolean(),
});

// 신청서 질문 — 양식 조회와 신청 상세가 같이 싣는 부분. 화면에는 eventsQuestions.ts에서 EventsQuestion으로 바꿔 넘긴다
export const eventQuestionContentSchema = z.looseObject({
  questionId: z.number(),
  questionText: z.string(),
  questionType: z.enum(EVENT_QUESTION_TYPES),
  isRequired: z.boolean(),
  // 신청서에서 몇 번째로 보일지(1부터)
  displayOrder: z.number(),
  // 선택지. 텍스트형 질문은 빈 배열이다
  options: z.array(z.string()),
});

export const eventFormSchema = z.looseObject({
  eventId: z.number(),
  title: z.string(),
  eventStartAt: z.string(),
  place: z.string().nullable(),
  questions: z.array(
    eventQuestionContentSchema.extend({
      // 답변 길이 제한. 선택형 질문은 null
      maxLength: z.number().nullable(),
    }),
  ),
});

// 완료 화면이 행사 요약을 그린다
export const eventApplyResultSchema = z.looseObject({
  applicationId: z.number(),
  title: z.string(),
  eventStartAt: z.string(),
  place: z.string().nullable(),
});

export const myEventApplicationListItemSchema = z.looseObject({
  applicationId: z.number(),
  eventId: z.number(),
  title: z.string(),
  thumbnailUrl: z.string().nullable(),
  applicationStatus: z.enum(EVENT_APPLICATION_STATUSES),
  appliedAt: z.string(),
  // 취소한 신청만 있다
  canceledAt: z.string().nullable(),
});

const myEventApplicationPageSchema = z.looseObject({
  content: z.array(myEventApplicationListItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullable(),
});

// 신청서 질문 한 건과 그 신청에서 제출한 답변
export const eventAnsweredQuestionSchema = eventQuestionContentSchema.extend({
  // 텍스트형 답변. 답하지 않은 선택 질문은 null
  answerText: z.string().nullable(),
  // 고른 선택지의 순서 번호(0부터). 답하지 않은 선택 질문은 빈 배열
  selectedOptions: z.array(z.number()),
});

// 행사 질문 전체에 이 신청의 답변을 붙여 준다
export const myEventApplicationDetailSchema = z.looseObject({
  eventId: z.number(),
  title: z.string(),
  place: z.string().nullable(),
  applicationStatus: z.enum(EVENT_APPLICATION_STATUSES),
  eventStartAt: z.string(),
  appliedAt: z.string(),
  // 취소한 신청만 있다
  canceledAt: z.string().nullable(),
  questions: z.array(eventAnsweredQuestionSchema),
});

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
  // 납부자 전용 행사에 미납자가 신청했다 — 학생회비 쪽 코드(FeeErrorCode)로 빌릴게 대여와 같다
  memberIsNotPayer: "MEMBER_IS_NOT_PAYER",
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
  // 서버가 모집중(신청 마감 임박순) → 모집예정(신청 시작 임박순) → 모집종료(최근 행사순)로 정렬해 준다 —
  // 필터를 걸어도 상태 안의 순서는 같아서 화면은 받은 순서대로 그린다. keyword는 검색 화면의 행사 탭이 제목으로 찾을 때만 넘긴다.
  list: (
    recruitStatus: EventRecruitStatus | null,
    keyword: string | null = null,
  ) =>
    infiniteQueryOptions({
      queryKey: eventsKeys.list(recruitStatus, keyword),
      queryFn: async ({ pageParam, signal }) =>
        eventListPageSchema.parse(
          await api.get<unknown>("/v1/app/events", {
            // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이, 전체는 recruitStatus 없이 간다
            params: { cursor: pageParam, keyword, recruitStatus },
            signal,
          }),
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 없는 행사는 null — 상세 화면이 "행사를 찾을 수 없어요" 빈 상태를 그린다.
  detail: (eventId: string) =>
    queryOptions({
      queryKey: eventsKeys.detail(eventId),
      queryFn: ({ signal }) =>
        nullOnErrorCode(
          api
            .get<unknown>(`/v1/app/events/${eventId}`, { signal })
            .then((data) => eventDetailSchema.parse(data)),
          [EVENTS_ERROR_CODES.eventNotFound],
        ),
    }),
  // 신청서 양식(GET /v1/app/events/{eventId}/form). 마감된 행사는 null — 신청서 화면이 마감 화면으로 보낸다.
  form: (eventId: string) =>
    queryOptions({
      queryKey: eventsKeys.form(eventId),
      queryFn: ({ signal }) =>
        nullOnErrorCode(
          api
            .get<unknown>(`/v1/app/events/${eventId}/form`, { signal })
            .then((data) => eventFormSchema.parse(data)),
          EVENTS_CLOSED_ERROR_CODES,
        ),
    }),
  // 내 신청내역을 커서로 이어 받는다(GET /v1/app/events/applications)
  applications: () =>
    infiniteQueryOptions({
      queryKey: eventsKeys.applications(),
      queryFn: async ({ pageParam, signal }) =>
        myEventApplicationPageSchema.parse(
          await api.get<unknown>("/v1/app/events/applications", {
            params: { cursor: pageParam },
            signal,
          }),
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
          api
            .get<unknown>(`/v1/app/events/applications/${applicationId}`, {
              signal,
            })
            .then((data) => myEventApplicationDetailSchema.parse(data)),
          [
            EVENTS_ERROR_CODES.applicationNotFound,
            EVENTS_ERROR_CODES.eventNotFound,
          ],
        ),
    }),
};

// 행사 신청(POST /v1/app/events/{eventId}/applications). 신청이 생기고 정원이 차서 모집 상태가 바뀔 수도 있어서
// 신청내역과 행사 목록·상세를 무효화한다. 홈의 신청 안내 카드(신청 여부)와 신청한 행사도 바뀌어서 홈도 무효화한다.
// 마감·이미 신청·신청 자격 없음으로 실패해도 지금 캐시가 낡았다는 뜻이라 같이 무효화한다.
// 신청서 양식은 무효화하지 않는다 — 신청서 화면이 떠 있는 동안 다시 받으면 마감된 양식이 화면을 마감으로 보낸다.
// 응답 형식이 달라도 서버에는 이미 신청이 생겼으니 실패로 바꾸지 않고 null을 돌려준다(사물함 신청과 같다).
export function useApplyEventMutation(eventId: string) {
  const queryClient = useQueryClient();
  const invalidateApplyTargets = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: eventsKeys.applications() }),
      queryClient.invalidateQueries({ queryKey: eventsKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: eventsKeys.detail(eventId) }),
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
    ]);

  return useMutation({
    mutationFn: async (answers: EventApplyAnswer[]) => {
      const response = eventApplyResultSchema.safeParse(
        await api.post<unknown>(`/v1/app/events/${eventId}/applications`, {
          answers,
        }),
      );
      if (!response.success) {
        console.error("행사 신청 응답 형식이 달라요.", response.error);
        return null;
      }
      return response.data;
    },
    // 신청서 화면은 바로 완료 화면으로 넘어가서 다시 받을 조회가 화면에 없다 — 낡은 표시만 하고 금방 끝난다
    onSuccess: invalidateApplyTargets,
    onError: (error) => {
      if (
        isApiError(error) &&
        (EVENTS_CLOSED_ERROR_CODES.includes(error.code) ||
          error.code === EVENTS_ERROR_CODES.alreadyApplied ||
          error.code === EVENTS_ERROR_CODES.memberIsNotPayer)
      ) {
        return invalidateApplyTargets();
      }
    },
  });
}

// 신청 취소(PATCH /v1/app/events/applications/{applicationId}/cancel). 신청 기록은 남고 상태만 취소로 바뀐다.
// 성공하면 신청내역 목록·상세를 다시 받아 취소 상태를 보여 준다. 홈의 신청한 행사·신청 안내 카드도 바뀌어서
// 홈도 무효화한다. 이미 취소된 신청이었다면 지금 캐시가 낡았다는 뜻이라 똑같이 다시 받는다.
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
      queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
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
