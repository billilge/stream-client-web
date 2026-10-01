import { BILILGE_ITEMS } from "@/entities/bililge/bililgeMock";
import type { BililgeItem } from "@/entities/bililge/types";
import { mockResponse } from "@/lib/mockResponse";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 bililgeQueries로만 데이터를 받는다.
export function fetchBililgeItems(): Promise<BililgeItem[]> {
  return mockResponse(BILILGE_ITEMS);
}
