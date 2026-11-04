import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { api, isApiError } from "@/shared/api";
import { billilgeKeys } from "@/shared/entities/billilge/billilgeKeys";
import { BILLILGE_ITEMS } from "@/shared/entities/billilge/billilgeMock";
import type {
  BillilgeHistoryListResponse,
  BillilgeRentalApplyRequest,
  BillilgeReturnRequiredListResponse,
} from "@/shared/entities/billilge/billilgeTypes";

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const billilgeQueries = {
  items: () =>
    queryOptions({
      queryKey: billilgeKeys.items(),
      queryFn: () => mockupResponse(() => BILLILGE_ITEMS),
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
