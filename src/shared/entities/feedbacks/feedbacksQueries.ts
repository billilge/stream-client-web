import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api, isApiError } from "@/shared/api";
import { feedbacksKeys } from "@/shared/entities/feedbacks/feedbacksKeys";
import { homeKeys } from "@/shared/entities/home/homeKeys";

const FEEDBACKS_PATH = "/v1/app/feedbacks";

// "최근 피드백" 캐러셀에 보여줄 건수 — 공개 목록의 첫 페이지 앞쪽(서버가 최근 공개 회차 순으로 정렬한다)
export const RECENT_FEEDBACKS_SIZE = 5;

// "N차 피드백 모아보기"가 한 번에 받는 최대 건수 — 서버 size 상한이다. 한 회차가 이를 넘으면 뒤쪽이 잘린다.
const ROUND_FEEDBACKS_SIZE = 100;

// 화면이 갈라 처리하는 서버 에러 코드(FeedbackErrorCode)
export const FEEDBACK_ERROR_CODES = {
  // 지금은 질문 접수 기간이 아니다
  notOpen: "FEEDBACK_NOT_OPEN",
  // 없는 피드백이거나, 남의 질문인데 공개된 답변이 없다(질문이 있다는 것도 드러내지 않는다)
  notFound: "FEEDBACK_NOT_FOUND",
} as const;

// 서버 응답 검사 — 서버가 필드를 더 보내도 깨지지 않게 looseObject로 두고, 빠지거나 타입이 바뀌면 여기서 실패한다.
// 답변이 없거나 공개 전이면 answer·answeredAt이 비어 온다(null 또는 생략). 일시는 오프셋 없는 KST("2026-05-06T10:00:00")다.
export const feedbackSchema = z.looseObject({
  feedbackId: z.number(),
  year: z.number(),
  round: z.number(),
  question: z.string(),
  questionedAt: z.string(),
  answeredAt: z.string().nullish(),
  answer: z.string().nullish(),
});

// 번호로 나눠 받는 목록(서버 PageResponse) — page는 0부터다
export const feedbackPageSchema = z.looseObject({
  content: z.array(feedbackSchema),
  page: z.number(),
  size: z.number(),
  totalCount: z.number(),
  totalPage: z.number(),
});

// 연도·차수 필터 — years는 답변이 공개된 연도 전체, rounds는 요청한 연도(없으면 올해)의 공개 회차다
export const feedbackRoundsSchema = z.looseObject({
  years: z.array(z.number()),
  year: z.number(),
  rounds: z.array(z.number()),
});

// 다음 페이지 번호 — 마지막 페이지면 null이라 더 받지 않는다
function getNextPage(lastPage: z.infer<typeof feedbackPageSchema>) {
  return lastPage.page + 1 < lastPage.totalPage ? lastPage.page + 1 : null;
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const feedbacksQueries = {
  // 공개된 답변이 있는 피드백을 최근 공개 회차 순으로 이어 받는다(GET /v1/app/feedbacks). 연도·차수는 서버가 걸러 준다
  // — 번호로 나눠 받아서 받은 것만 거르면 다음 페이지의 피드백이 빠진다. 한 번에 서버 기본값(20건)씩 받는다.
  // keyword는 검색 화면의 열린피드백 탭이 질문으로 찾을 때만 넘긴다.
  list: (
    year: number | null,
    round: number | null,
    keyword: string | null = null,
  ) =>
    infiniteQueryOptions({
      queryKey: feedbacksKeys.list(year, round, keyword),
      queryFn: async ({ pageParam, signal }) =>
        feedbackPageSchema.parse(
          await api.get<unknown>(FEEDBACKS_PATH, {
            // axios는 null인 파라미터를 보내지 않는다 — 전체는 year·round 없이 간다
            params: { keyword, page: pageParam, round, year },
            signal,
          }),
        ),
      initialPageParam: 0,
      getNextPageParam: getNextPage,
    }),
  // "최근 피드백" 캐러셀 — 필터 없는 공개 목록의 첫 페이지 앞쪽만 받는다
  recent: () =>
    queryOptions({
      queryKey: feedbacksKeys.recent(),
      queryFn: async ({ signal }) =>
        feedbackPageSchema.parse(
          await api.get<unknown>(FEEDBACKS_PATH, {
            params: { page: 0, size: RECENT_FEEDBACKS_SIZE },
            signal,
          }),
        ),
    }),
  // 연도·차수 필터(GET /v1/app/feedbacks/rounds). 연도가 null이면 서버가 올해로 본다
  rounds: (year: number | null) =>
    queryOptions({
      queryKey: feedbacksKeys.rounds(year),
      queryFn: async ({ signal }) =>
        feedbackRoundsSchema.parse(
          await api.get<unknown>(`${FEEDBACKS_PATH}/rounds`, {
            params: { year },
            signal,
          }),
        ),
    }),
  // "N차 피드백 모아보기" — 그 회차의 공개 피드백을 한 번에 받는다(서버 정렬 그대로)
  roundFeedbacks: (year: number, round: number) =>
    queryOptions({
      queryKey: feedbacksKeys.roundFeedbacks(year, round),
      queryFn: async ({ signal }) =>
        feedbackPageSchema.parse(
          await api.get<unknown>(FEEDBACKS_PATH, {
            params: { page: 0, round, size: ROUND_FEEDBACKS_SIZE, year },
            signal,
          }),
        ),
    }),
  // 없는 피드백은 null — 화면이 목록으로 보내거나 "존재하지 않는 피드백이에요"를 그린다.
  // 내가 쓴 질문은 답변이 없어도, 남의 질문은 공개된 답변이 있을 때만 받는다.
  detail: (feedbackId: number) =>
    queryOptions({
      queryKey: feedbacksKeys.detail(feedbackId),
      queryFn: async ({ signal }) => {
        try {
          return feedbackSchema.parse(
            await api.get<unknown>(`${FEEDBACKS_PATH}/${feedbackId}`, {
              signal,
            }),
          );
        } catch (error) {
          if (
            isApiError(error) &&
            error.code === FEEDBACK_ERROR_CODES.notFound
          ) {
            return null;
          }
          throw error;
        }
      },
    }),
  // 내가 쓴 피드백을 최근 작성순으로 이어 받는다(GET /v1/app/feedbacks/mine). 공개 전 회차의 답변은 비어 온다
  mine: () =>
    infiniteQueryOptions({
      queryKey: feedbacksKeys.mine(),
      queryFn: async ({ pageParam, signal }) =>
        feedbackPageSchema.parse(
          await api.get<unknown>(`${FEEDBACKS_PATH}/mine`, {
            params: { page: pageParam },
            signal,
          }),
        ),
      initialPageParam: 0,
      getNextPageParam: getNextPage,
    }),
};

// 피드백 질문 등록. 접수 중인 회차에 들어가고, 접수 기간이 아니면 FEEDBACK_NOT_OPEN으로 거절된다.
// 성공하면 작성내역이 바뀌어서 내 피드백 캐시를 무효화한다 — 새 질문은 답변이 없어 공개 목록에는 아직 없다.
// 홈 내 정보의 작성 수도 바뀌어서 홈도 무효화한다.
export function useCreateFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: string) =>
      api.post<unknown>(FEEDBACKS_PATH, { question }),
    // Promise를 돌려줘서 다시 받은 목록이 들어온 뒤에 mutation이 끝나게 한다
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: feedbacksKeys.mine() }),
        queryClient.invalidateQueries({ queryKey: homeKeys.root() }),
      ]),
  });
}
