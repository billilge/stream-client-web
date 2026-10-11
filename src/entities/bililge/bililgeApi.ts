import { BILILGE_ITEMS } from "@/entities/bililge/bililgeMock";
import type { BililgeItem } from "@/entities/bililge/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchBililgeItems(): Promise<BililgeItem[]> {
  return mockupApi("bililge/items", () => BILILGE_ITEMS);
}
