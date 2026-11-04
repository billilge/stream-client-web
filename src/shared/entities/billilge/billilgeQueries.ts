import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { api, type CursorSliceResponse, isApiError } from "@/shared/api";
import { billilgeKeys } from "@/shared/entities/billilge/billilgeKeys";
import type {
  BillilgeCategory,
  BillilgeHistoryListResponse,
  BillilgeItem,
  BillilgeRentalApplyRequest,
  BillilgeReturnRequiredListResponse,
} from "@/shared/entities/billilge/billilgeTypes";

// 커서 목록의 다음 페이지 — 마지막 페이지면 null이라 더 받지 않는다
function getNextCursor(lastPage: CursorSliceResponse<unknown>) {
  return lastPage.hasNext ? lastPage.nextCursor : null;
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const billilgeQueries = {
  // 물품 목록을 이름순 커서로 이어 받는다(GET /v1/app/billilge/items). category가 null이면 거르지 않는다.
  // 한 번에 서버 기본값(20개)씩 받는다.
  items: (category: BillilgeCategory | null) =>
    infiniteQueryOptions({
      queryKey: billilgeKeys.itemList(category),
      queryFn: ({ pageParam, signal }) =>
        api.get<CursorSliceResponse<BillilgeItem>>("/v1/app/billilge/items", {
          // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이, 전체는 category 없이 간다
          params: { category, cursor: pageParam },
          signal,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 내 대여 이력 전체(상태 필터 없음), 최근 신청순. 페이지 없이 한 번에 온다
  histories: () =>
    queryOptions({
      queryKey: billilgeKeys.histories(),
      queryFn: ({ signal }) =>
        api.get<BillilgeHistoryListResponse>("/v1/app/billilge/histories", {
          signal,
        }),
    }),
  // 지금 반납해야 하는 대여(대여 중·반납 신청 중)와 반납 기한 — 빌릴게 반납 탭과 홈 대여 현황이 같이 쓴다
  returnRequired: () =>
    queryOptions({
      queryKey: billilgeKeys.returnRequired(),
      queryFn: ({ signal }) =>
        api.get<BillilgeReturnRequiredListResponse>(
          "/v1/app/billilge/histories/return-required",
          { signal },
        ),
    }),
};

// 대여 신청에서 화면이 갈라 처리하는 서버 에러 코드(RentalErrorCode·FeeErrorCode·CommonErrorCode)
export const BILLILGE_ERROR_CODES = {
  // 대여 시각 — 영업시간(10~17시) 밖, 점심시간, 지금+5분보다 이름. 서버가 이 순서로 검사한다
  timeOutOfRange: "INVALID_RENTAL_TIME_RANGE",
  timeLunchBreak: "INVALID_RENTAL_TIME_LUNCH_BREAK",
  timeTooSoon: "INVALID_RENTAL_TIME_PAST",
  // 같은 물품에 끝나지 않은 신청이 있다 — ignoreDuplicate: true로 다시 보내면 그래도 신청한다
  duplicated: "RENTAL_ITEM_DUPLICATED",
  // 그새 재고가 떨어졌거나 물품이 지워졌다 — 물품 목록이 낡았다
  outOfStock: "ITEM_OUT_OF_STOCK",
  itemNotFound: "ITEM_NOT_FOUND",
  // 반납 신청할 수 있는 대여(대여 중인 내 대여)가 아니다 — 이미 반납을 신청했거나 상태가 바뀌었다
  rentalNotFound: "RENTAL_NOT_FOUND",
} as const;

// 대여 신청. 학생 신청은 승인 대기(PENDING)로 시작하고 재고는 신청할 때 바로 줄어든다.
// 성공하면 재고·대여 내역이 바뀌어서 빌릴게 캐시를 통째로 무효화한다 — 재고 부족·없는 물품으로 거절돼도
// 지금 물품 목록이 낡았다는 뜻이라 같이 무효화한다.
export function useApplyBillilgeRentalMutation() {
  const queryClient = useQueryClient();
  const invalidateBillilge = () =>
    queryClient.invalidateQueries({ queryKey: billilgeKeys.root() });

  return useMutation({
    mutationFn: (request: BillilgeRentalApplyRequest) =>
      api.post<null>("/v1/app/billilge/histories", request),
    // Promise를 돌려줘서 다시 받은 재고가 들어온 뒤에 mutation이 끝나게 한다
    onSuccess: invalidateBillilge,
    onError: (error) => {
      if (
        isApiError(error) &&
        (error.code === BILLILGE_ERROR_CODES.outOfStock ||
          error.code === BILLILGE_ERROR_CODES.itemNotFound)
      ) {
        return invalidateBillilge();
      }
    },
  });
}

// 반납 신청. 대여 중(RENTAL)인 내 대여만 받고, 바로 끝나지 않고 반납 승인 대기(RETURN_PENDING)가 된다.
// 성공하면 반납 필요 대여·대여 내역의 상태가 바뀌어서 대여 이력 캐시를 무효화한다 — 반납할 수 없는 대여라는 거절도
// 지금 캐시가 낡았다는 뜻이라 같이 무효화한다.
export function useReturnBillilgeRentalMutation() {
  const queryClient = useQueryClient();
  const invalidateHistories = () =>
    queryClient.invalidateQueries({ queryKey: billilgeKeys.histories() });

  return useMutation({
    mutationFn: (rentalHistoryId: number) =>
      api.patch<null>(`/v1/app/billilge/histories/${rentalHistoryId}/return`),
    // Promise를 돌려줘서 다시 받은 상태가 들어온 뒤에 mutation이 끝나게 한다
    onSuccess: invalidateHistories,
    onError: (error) => {
      if (
        isApiError(error) &&
        error.code === BILLILGE_ERROR_CODES.rentalNotFound
      ) {
        return invalidateHistories();
      }
    },
  });
}
