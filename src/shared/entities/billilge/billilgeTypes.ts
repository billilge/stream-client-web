// 서버 학생 앱 빌릴게 API(/v1/app/billilge/**) 응답 모양 그대로다 — 화면 모양은 화면 쪽에서 바꾼다.

// 물품 분류(서버 ItemCategory). 화면 라벨은 features/billilge/constants/billilge.ts의 BILLILGE_CATEGORY_LABELS
export type BillilgeCategory =
  | "ELECTRONICS"
  | "DAILY_SUPPLIES"
  | "MEDICINE"
  | "HYGIENE";

// 소모품은 돌려받지 않아서 반납 정책·반납 기한 문구가 없다(서버 ItemType)
export type BillilgeItemType = "CONSUMABLE" | "RENTAL";

export interface BillilgeReturnPolicy {
  maxRentalDays: number;
  // 반납 마감 시각 "17:00"
  returnDeadline: string;
}

export interface BillilgeItem {
  itemId: number;
  name: string;
  category: BillilgeCategory;
  type: BillilgeItemType;
  // 지금 남은 재고
  count: number;
  // 물품 아이콘(SVG) 주소. 아이콘을 안 올린 물품은 null
  imageUrl: string | null;
  returnPolicy: BillilgeReturnPolicy | null;
  // 대여 바텀시트의 "대여할 물품" 카드(Figma nodeId 1422:57184, 3013:114608)에 "수량 28 · {문구}"로
  // 붙는 반납 기한 — 오늘 빌린다고 치고 서버가 "오늘 17시까지 반납"/"내일까지 반납"/"9/29까지 반납"을
  // 정해 내려준다(서버 #243). 반납 정책을 가진 서버가 문구까지 정해서 화면은 다시 가공하지 않는다. 소모품은 null
  returnDeadlineLabel: string | null;
}

// 대여 상태(서버 RentalStatus). 학생 신청은 승인 대기(PENDING)로 시작하고, 운영진이 승인(CONFIRMED)·지급(RENTAL)한다.
// 반납 신청은 반납 승인 대기(RETURN_PENDING)가 되고, 운영진이 승인(RETURN_CONFIRMED)·확인(RETURNED)한다.
// 화면 뱃지는 features/billilge/constants/billilge.ts의 BILLILGE_STATUS_BADGES
export type BillilgeRentalStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCEL"
  | "RENTAL"
  | "RETURN_PENDING"
  | "RETURN_CONFIRMED"
  | "RETURNED";

// 내 대여 이력 한 건(GET /v1/app/billilge/histories). 일시는 오프셋 없는 KST("2026-11-04T13:25:00")
export interface BillilgeHistory {
  rentalHistoryId: number;
  // 물품이 지워졌으면 이름·아이콘이 null이다
  itemName: string | null;
  itemImageUrl: string | null;
  // 신청 때 고른 대여 시작 시각 — 운영진이 지급(RENTAL)하면 실제로 받은 시각으로 바뀐다
  rentAt: string | null;
  // 반납이 확인(RETURNED)돼야 채워진다
  returnedAt: string | null;
  status: BillilgeRentalStatus;
}

export interface BillilgeHistoryListResponse {
  histories: BillilgeHistory[];
}

// 지금 반납해야 하는 대여 한 건(GET /v1/app/billilge/histories/return-required). 상태는 RENTAL·RETURN_PENDING·RETURN_CONFIRMED 중 하나
export interface BillilgeReturnRequired {
  rentalHistoryId: number;
  itemName: string | null;
  itemImageUrl: string | null;
  status: BillilgeRentalStatus;
  // 반납 마감 일시(대여일 + 최대 대여 일수의 마감 시각)
  dueAt: string;
}

export interface BillilgeReturnRequiredListResponse {
  rentalHistories: BillilgeReturnRequired[];
}

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
