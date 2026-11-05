import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { api, type CursorSliceResponse, isApiError } from "@/shared/api";
import { billilgeKeys } from "@/shared/entities/billilge/billilgeKeys";
import type {
  BillilgeAdminRentalStatusUpdate,
  BillilgeCategory,
  BillilgeRentalApplyRequest,
} from "@/shared/entities/billilge/billilgeTypes";
import { notificationsKeys } from "@/shared/entities/notifications/notificationsKeys";

const BILLILGE_PATH = "/v1/app/billilge";
const BILLILGE_ADMIN_PATH = "/v1/admin/billilge";

// 서버 enum(ItemCategory·ItemType·RentalStatus) 값 — 타입은 billilgeTypes.ts가 여기서 만든다
export const BILLILGE_CATEGORIES = [
  "ELECTRONICS",
  "DAILY_SUPPLIES",
  "MEDICINE",
  "HYGIENE",
] as const;

export const BILLILGE_ITEM_TYPES = ["CONSUMABLE", "RENTAL"] as const;

export const BILLILGE_RENTAL_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "CANCEL",
  "RENTAL",
  "RETURN_PENDING",
  "RETURN_CONFIRMED",
  "RETURNED",
] as const;

// 서버 응답 검사 — 서버가 필드를 더 보내도 깨지지 않게 looseObject로 두고, 빠지거나 타입이 바뀌면 여기서 실패한다.
// 일시는 오프셋 없는 KST("2026-11-04T13:25:00")다.
export const billilgeItemSchema = z.looseObject({
  itemId: z.number(),
  name: z.string(),
  category: z.enum(BILLILGE_CATEGORIES),
  // 소모품은 돌려받지 않아서 반납 정책·반납 기한 문구가 없다
  type: z.enum(BILLILGE_ITEM_TYPES),
  // 지금 남은 재고
  count: z.number(),
  // 물품 아이콘(SVG) 주소. 아이콘을 안 올린 물품은 null
  imageUrl: z.string().nullable(),
  returnPolicy: z
    .looseObject({
      maxRentalDays: z.number(),
      // 반납 마감 시각 "17:00"
      returnDeadline: z.string(),
    })
    .nullable(),
  // 대여 바텀시트의 "대여할 물품" 카드(Figma nodeId 1422:57184, 3013:114608)에 "수량 28 · {문구}"로
  // 붙는 반납 기한 — 오늘 빌린다고 치고 서버가 "오늘 17시까지 반납"/"내일까지 반납"/"9/29까지 반납"을
  // 정해 내려준다(서버 #243). 반납 정책을 가진 서버가 문구까지 정해서 화면은 다시 가공하지 않는다. 소모품은 null
  returnDeadlineLabel: z.string().nullable(),
});

const billilgeItemPageSchema = z.looseObject({
  content: z.array(billilgeItemSchema),
  hasNext: z.boolean(),
  nextCursor: z.string().nullable(),
});

export const billilgeHistorySchema = z.looseObject({
  rentalHistoryId: z.number(),
  // 물품이 지워졌으면 이름·아이콘이 null이다
  itemName: z.string().nullable(),
  itemImageUrl: z.string().nullable(),
  // 신청 때 고른 대여 시작 시각 — 운영진이 지급(RENTAL)하면 실제로 받은 시각으로 바뀐다
  rentAt: z.string().nullable(),
  // 반납이 확인(RETURNED)돼야 채워진다
  returnedAt: z.string().nullable(),
  status: z.enum(BILLILGE_RENTAL_STATUSES),
});

export const billilgeHistoryListResponseSchema = z.looseObject({
  histories: z.array(billilgeHistorySchema),
});

// 상태는 RENTAL·RETURN_PENDING·RETURN_CONFIRMED 중 하나
export const billilgeReturnRequiredSchema = z.looseObject({
  rentalHistoryId: z.number(),
  itemName: z.string().nullable(),
  itemImageUrl: z.string().nullable(),
  status: z.enum(BILLILGE_RENTAL_STATUSES),
  // 반납 마감 일시(대여일 + 최대 대여 일수의 마감 시각)
  dueAt: z.string(),
});

export const billilgeReturnRequiredListResponseSchema = z.looseObject({
  rentalHistories: z.array(billilgeReturnRequiredSchema),
});

// 커서 목록의 다음 페이지 — 마지막 페이지면 null이라 더 받지 않는다
function getNextCursor(lastPage: CursorSliceResponse<unknown>) {
  return lastPage.hasNext ? lastPage.nextCursor : null;
}

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 select를 더한다.
export const billilgeQueries = {
  // 물품 목록을 이름순 커서로 이어 받는다(GET /v1/app/billilge/items). category가 null이면 거르지 않는다.
  // 한 번에 서버 기본값(20개)씩 받는다. keyword는 검색 화면의 빌릴게 탭이 이름으로 찾을 때만 넘긴다.
  items: (category: BillilgeCategory | null, keyword: string | null = null) =>
    infiniteQueryOptions({
      queryKey: billilgeKeys.itemList(category, keyword),
      queryFn: async ({ pageParam, signal }) =>
        billilgeItemPageSchema.parse(
          await api.get<unknown>(`${BILLILGE_PATH}/items`, {
            // axios는 null인 파라미터를 보내지 않는다 — 첫 페이지는 cursor 없이, 전체는 category 없이 간다
            params: { category, cursor: pageParam, keyword },
            signal,
          }),
        ),
      initialPageParam: null as string | null,
      getNextPageParam: getNextCursor,
    }),
  // 내 대여 이력 전체(상태 필터 없음), 최근 신청순. 페이지 없이 한 번에 온다
  histories: () =>
    queryOptions({
      queryKey: billilgeKeys.histories(),
      queryFn: async ({ signal }) =>
        billilgeHistoryListResponseSchema.parse(
          await api.get<unknown>(`${BILLILGE_PATH}/histories`, { signal }),
        ),
    }),
  // 지금 반납해야 하는 대여(대여 중·반납 신청 중)와 반납 기한 — 빌릴게 반납 탭과 홈 대여 현황이 같이 쓴다
  returnRequired: () =>
    queryOptions({
      queryKey: billilgeKeys.returnRequired(),
      queryFn: async ({ signal }) =>
        billilgeReturnRequiredListResponseSchema.parse(
          await api.get<unknown>(`${BILLILGE_PATH}/histories/return-required`, {
            signal,
          }),
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
  // 관리자 상태 변경 — 화면에서 본 상태와 지금 상태가 다르다(다른 관리자가 먼저 처리했거나 옛 화면에서 눌렀다)
  rentalStatusChanged: "RENTAL_STATUS_CHANGED",
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
      api.post<null>(`${BILLILGE_PATH}/histories`, request),
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
      api.patch<null>(`${BILLILGE_PATH}/histories/${rentalHistoryId}/return`),
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

// 관리자 대여 상태 변경(PATCH /v1/admin/billilge/histories/{id}). 관리자 알림 화면은 화면에서 본 상태(expectedStatus)를
// 같이 보내서, 그사이 다른 관리자가 처리했으면 서버가 RENTAL_STATUS_CHANGED(409)로 거절하고 아무것도 바꾸지 않는다.
// 성공해도, 그렇게 거절돼도 관리자 알림 목록의 대여 상태가 낡아서 다시 받는다 — Promise를 돌려줘서 다시 받은 상태가
// 들어온 뒤에 mutation이 끝나게 한다(버튼 로딩이 그때까지 이어진다).
export function useUpdateAdminRentalStatusMutation() {
  const queryClient = useQueryClient();
  const refetchAdminNotifications = () =>
    queryClient.invalidateQueries({
      queryKey: notificationsKeys.adminList(),
    });

  return useMutation({
    mutationFn: ({
      rentalHistoryId,
      ...request
    }: BillilgeAdminRentalStatusUpdate) =>
      api.patch<unknown>(
        `${BILLILGE_ADMIN_PATH}/histories/${rentalHistoryId}`,
        request,
      ),
    onSuccess: refetchAdminNotifications,
    onError: (error) => {
      if (
        isApiError(error) &&
        error.code === BILLILGE_ERROR_CODES.rentalStatusChanged
      ) {
        return refetchAdminNotifications();
      }
    },
  });
}
