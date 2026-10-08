import type { SearchResults } from "@/entities/search/types";

// 검색 결과 카테고리 — 키는 용어 사전(terminology.md)의 코드 용어를 그대로 쓴다.
export type SearchCategory =
  | "events"
  | "notices"
  | "feedbacks"
  | "bililge"
  | "archives";

export type SearchTab = "all" | SearchCategory;

export const SEARCH_CATEGORY_LABELS = {
  archives: "아카이빙",
  bililge: "빌릴게",
  events: "행사",
  feedbacks: "열린피드백",
  notices: "공지",
} satisfies Record<SearchCategory, string>;

// Figma 탭 순서: 전체 → 행사 → 공지 → 열린피드백 → 빌릴게 → 아카이빙 (nodeId 3147:138705)
export const SEARCH_TABS: SearchTab[] = [
  "all",
  "events",
  "notices",
  "feedbacks",
  "bililge",
  "archives",
];

// 전체 탭의 섹션 순서는 탭 순서와 다르다: 행사 → 공지 → 아카이빙 → 빌릴게 → 열린피드백
// (nodeId 3147:138695). 화면설계서 4번: 카테고리별 최대 2개만 보여주고, 그보다 많으면 "n개 더보기".
export const SEARCH_ALL_TAB_SECTIONS: SearchCategory[] = [
  "events",
  "notices",
  "archives",
  "bililge",
  "feedbacks",
];
export const SEARCH_ALL_TAB_PREVIEW_COUNT = 2;

export function getSearchTabLabel(tab: SearchTab): string {
  return tab === "all" ? "전체" : SEARCH_CATEGORY_LABELS[tab];
}

export function isSearchTab(value: string | null): value is SearchTab {
  return SEARCH_TABS.some((tab) => tab === value);
}

// 진입한 화면에 맞는 첫 탭을 쿼리로 넘긴다 — 홈 검색은 전체 탭부터, 기능 내 검색은 해당 탭부터
// 보여준다(화면설계서 3번).
export function getSearchPath(tab: SearchTab = "all"): string {
  return tab === "all" ? "/search" : `/search?tab=${tab}`;
}

// 탭명에 붙는 결과 수(화면설계서 6번) — 전체 탭은 모든 카테고리의 합이다.
export function getSearchResultCount(
  results: SearchResults,
  tab: SearchTab,
): number {
  if (tab === "all") {
    return SEARCH_ALL_TAB_SECTIONS.reduce(
      (sum, category) => sum + results[category].length,
      0,
    );
  }
  return results[tab].length;
}
