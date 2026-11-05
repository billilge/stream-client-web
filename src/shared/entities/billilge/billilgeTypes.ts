import type { z } from "zod";

import type {
  BILLILGE_CATEGORIES,
  BILLILGE_ITEM_TYPES,
  BILLILGE_RENTAL_STATUSES,
  billilgeHistoryListResponseSchema,
  billilgeHistorySchema,
  billilgeItemSchema,
  billilgeReturnRequiredListResponseSchema,
  billilgeReturnRequiredSchema,
} from "@/shared/entities/billilge/billilgeQueries";

// 서버 학생 앱 빌릴게 API(/v1/app/billilge/**) 응답 모양 그대로다 — billilgeQueries.ts의 응답 검사 스키마에서 만든다.
// 화면 모양은 화면 쪽에서 바꾼다.

// 물품 분류(서버 ItemCategory). 화면 라벨은 features/billilge/constants/billilge.ts의 BILLILGE_CATEGORY_LABELS
export type BillilgeCategory = (typeof BILLILGE_CATEGORIES)[number];

// 소모품은 돌려받지 않아서 반납 정책·반납 기한 문구가 없다(서버 ItemType)
export type BillilgeItemType = (typeof BILLILGE_ITEM_TYPES)[number];

export type BillilgeItem = z.infer<typeof billilgeItemSchema>;

// 대여 상태(서버 RentalStatus). 학생 신청은 승인 대기(PENDING)로 시작하고, 운영진이 승인(CONFIRMED)·지급(RENTAL)한다.
// 반납 신청은 반납 승인 대기(RETURN_PENDING)가 되고, 운영진이 승인(RETURN_CONFIRMED)·확인(RETURNED)한다.
// 화면 뱃지는 features/billilge/constants/billilge.ts의 BILLILGE_STATUS_BADGES
export type BillilgeRentalStatus = (typeof BILLILGE_RENTAL_STATUSES)[number];

// 내 대여 이력 한 건(GET /v1/app/billilge/histories)
export type BillilgeHistory = z.infer<typeof billilgeHistorySchema>;

export type BillilgeHistoryListResponse = z.infer<
  typeof billilgeHistoryListResponseSchema
>;

// 지금 반납해야 하는 대여 한 건(GET /v1/app/billilge/histories/return-required)
export type BillilgeReturnRequired = z.infer<
  typeof billilgeReturnRequiredSchema
>;

export type BillilgeReturnRequiredListResponse = z.infer<
  typeof billilgeReturnRequiredListResponseSchema
>;

// 대여 신청(POST /v1/app/billilge/histories). 날짜는 늘 오늘이라 시각만 보낸다
export interface BillilgeRentalApplyRequest {
  itemId: number;
  count: number;
  // 0~23시
  rentAtHour: number;
  rentAtMinute: number;
  // false면 같은 물품에 끝나지 않은 신청이 있을 때 RENTAL_ITEM_DUPLICATED로 거절된다 — true로 다시 보내면 그래도 신청한다
  ignoreDuplicate: boolean;
}

// 관리자 대여 상태 변경(PATCH /v1/admin/billilge/histories/{id}) — 관리자 알림 화면의 반려·승인·완료 버튼이 쓴다
export interface BillilgeAdminRentalStatusUpdate {
  rentalHistoryId: number;
  rentalStatus: BillilgeRentalStatus;
  // 화면에서 본 지금 상태 — 실제 지금 상태와 다르면 서버가 RENTAL_STATUS_CHANGED로 거절하고 아무것도 바꾸지 않는다
  expectedStatus: BillilgeRentalStatus;
}
