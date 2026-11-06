import { getTimeUntil } from "@/lib/date";
import type {
  BillilgeCategory,
  BillilgeItem,
  BillilgeRentalStatus,
} from "@/shared/entities/billilge/billilgeTypes";

// 빌릴게의 대여/반납 탭은 경로로 나눈다(행사 목록 EVENTS_TAB_PATHS와 같은 방식) — 새로고침·뒤로가기에도
// 탭이 유지되고, 홈 대여 현황 "더보기"처럼 다른 화면에서도 반납 탭으로 바로 보낼 수 있다.
export const BILLILGE_TAB_PATHS = {
  rent: "/billilge",
  return: "/billilge/returns",
} as const;

export type BillilgeTab = keyof typeof BILLILGE_TAB_PATHS;

// 빌릴게 대여 탭으로 보내면서 넘기는 history state — 검색 결과에서 대여 신청을 누르면 그 물품을 실어 보내서,
// 빌릴게 화면이 들어오자마자 그 물품의 대여 바텀시트를 연다(대여 시트는 빌릴게 화면 안의 상태라 검색 화면에서 직접 열 수 없다).
export interface BillilgeListLocationState {
  rentalItem?: BillilgeItem;
}

// 카테고리 칩 라벨 — 칩 값은 서버 ItemCategory를 그대로 쓴다. 순서는 Figma Filter Row(1243:73337)
export const BILLILGE_CATEGORY_LABELS = {
  ELECTRONICS: "전자기기",
  DAILY_SUPPLIES: "생활잡화",
  MEDICINE: "상비약",
  HYGIENE: "위생용품",
} satisfies Record<BillilgeCategory, string>;

// 대여 상태 뱃지 — Figma 빌릴게 대여내역 뱃지(1133:50036). 승인을 기다리는 두 상태만 회색(neutral)이고
// 나머지는 accent 색이다. 대여 내역·반납이 필요한 물품·홈 대여 현황이 같이 쓴다.
export const BILLILGE_STATUS_BADGES = {
  PENDING: {
    color: "neutral",
    label: "대여 승인대기",
    token: "semantic.label.alternative",
  },
  CONFIRMED: {
    color: "accent",
    label: "수령대기",
    token: "semantic.accent.foreground.orange",
  },
  RENTAL: {
    color: "accent",
    label: "대여중",
    token: "semantic.accent.foreground.blue",
  },
  RETURN_PENDING: {
    color: "neutral",
    label: "반납 승인대기",
    token: "semantic.label.alternative",
  },
  RETURN_CONFIRMED: {
    color: "accent",
    label: "반납대기",
    token: "semantic.accent.foreground.orange",
  },
  RETURNED: {
    color: "accent",
    label: "반납완료",
    token: "semantic.accent.foreground.green",
  },
  CANCEL: {
    color: "accent",
    label: "대기취소",
    token: "semantic.accent.foreground.red",
  },
  REJECTED: {
    color: "accent",
    label: "대여불가",
    token: "semantic.accent.foreground.red",
  },
} as const satisfies Record<
  BillilgeRentalStatus,
  { color: "neutral" | "accent"; label: string; token: string }
>;

// 반납 기한 문구 — 빌릴게 반납 탭과 홈 대여 현황이 같이 쓴다. Figma는 "반납까지 N시간"만 있는데, 며칠짜리 대여는
// 시간 숫자가 커져서 24시간이 넘으면 일 단위로 보여 준다(getTimeUntil). 기한이 지나면 빨간 문구(3147:146331)다.
export function getReturnDueLabel(dueAt: string): {
  text: string;
  isOverdue: boolean;
} {
  const { amount, unit } = getTimeUntil(dueAt);
  const unitLabel = unit === "days" ? "일" : "시간";
  return amount < 0
    ? { isOverdue: true, text: `반납 기한이 ${-amount}${unitLabel} 지났어요` }
    : { isOverdue: false, text: `반납까지 ${amount}${unitLabel}` };
}

// 대여 이력에 남은 물품이 지워졌으면 서버가 이름을 null로 준다
export const BILLILGE_DELETED_ITEM_NAME = "삭제된 물품";

// 카테고리 필터에서 "전체"(필터 없음)를 뜻하는 칩 값
export const BILLILGE_ALL_CATEGORIES = "ALL";

export type BillilgeCategoryFilterValue =
  | BillilgeCategory
  | typeof BILLILGE_ALL_CATEGORIES;
