import type { BillilgeCategory } from "@/shared/entities/billilge/billilgeTypes";

// 빌릴게의 대여/반납 탭은 경로로 나눈다(행사 목록 EVENTS_TAB_PATHS와 같은 방식) — 새로고침·뒤로가기에도
// 탭이 유지되고, 홈 대여 현황 "더보기"처럼 다른 화면에서도 반납 탭으로 바로 보낼 수 있다.
export const BILLILGE_TAB_PATHS = {
  rent: "/billilge",
  return: "/billilge/returns",
} as const;

export type BillilgeTab = keyof typeof BILLILGE_TAB_PATHS;

// 카테고리 칩 라벨 — 칩 값은 서버 ItemCategory를 그대로 쓴다. 순서는 Figma Filter Row(1243:73337)
export const BILLILGE_CATEGORY_LABELS = {
  ELECTRONICS: "전자기기",
  DAILY_SUPPLIES: "생활잡화",
  MEDICINE: "상비약",
  HYGIENE: "위생용품",
} satisfies Record<BillilgeCategory, string>;

// 카테고리 필터에서 "전체"(필터 없음)를 뜻하는 칩 값
export const BILLILGE_ALL_CATEGORIES = "ALL";

export type BillilgeCategoryFilterValue =
  | BillilgeCategory
  | typeof BILLILGE_ALL_CATEGORIES;
