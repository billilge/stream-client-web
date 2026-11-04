import type { BillilgeCategory } from "@/shared/entities/billilge/billilgeTypes";

// 조회 캐시 key. 반납 필요 대여는 대여 이력 key 아래에 둬서, 이력 key 하나로 둘을 같이 무효화한다.
// 물품 목록은 카테고리·검색어마다 따로 받아서 key에 넣는다 — items()로 모든 카테고리를 같이 무효화한다.
export const billilgeKeys = {
  root: () => ["billilge"] as const,
  items: () => [...billilgeKeys.root(), "items"] as const,
  itemList: (category: BillilgeCategory | null, keyword: string | null) =>
    [...billilgeKeys.items(), category, keyword] as const,
  histories: () => [...billilgeKeys.root(), "histories"] as const,
  returnRequired: () =>
    [...billilgeKeys.histories(), "return-required"] as const,
};
