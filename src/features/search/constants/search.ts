import type { ArchiveListItemResponse } from "@/shared/entities/archives/archivesTypes";
import type { BillilgeItem } from "@/shared/entities/billilge/billilgeTypes";
import type { EventListItem } from "@/shared/entities/events/eventsTypes";
import type { FeedbackResponse } from "@/shared/entities/feedbacks/feedbacksTypes";
import type { NoticeListItem } from "@/shared/entities/notices/noticesTypes";
import type { SearchResponse } from "@/shared/entities/search/searchTypes";

// 검색 결과 카테고리 — 키는 용어 사전(terminology.md)의 코드 용어를 그대로 쓴다.
export type SearchCategory =
  | "events"
  | "notices"
  | "feedbacks"
  | "billilge"
  | "archives";

export type SearchTab = "all" | SearchCategory;

export const SEARCH_CATEGORY_LABELS = {
  archives: "아카이빙",
  billilge: "빌릴게",
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
  "billilge",
  "archives",
];

// 전체 탭의 섹션 순서는 탭 순서와 다르다: 행사 → 공지 → 아카이빙 → 빌릴게 → 열린피드백
// (nodeId 3147:138695). 화면설계서 4번: 카테고리별 최대 2개만 보여주고(서버가 2건씩 준다), 그보다 많으면 "n개 더보기".
export const SEARCH_ALL_TAB_SECTIONS: SearchCategory[] = [
  "events",
  "notices",
  "archives",
  "billilge",
  "feedbacks",
];

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

// 화면 카테고리(용어 사전 코드 용어)와 통합 검색 응답의 섹션 이름 — 빌릴게만 서버 이름이 items다
const SEARCH_RESPONSE_SECTIONS = {
  archives: "archives",
  billilge: "items",
  events: "events",
  feedbacks: "feedbacks",
  notices: "notices",
} as const satisfies Record<SearchCategory, keyof SearchResponse>;

// 한 카테고리의 카드 목록 — 카드는 각 목록 API의 항목 응답 그대로다
export type SearchCategoryEntries =
  | { category: "events"; items: EventListItem[] }
  | { category: "notices"; items: NoticeListItem[] }
  | { category: "feedbacks"; items: FeedbackResponse[] }
  | { category: "billilge"; items: BillilgeItem[] }
  | { category: "archives"; items: ArchiveListItemResponse[] };

// 전체 탭 섹션의 미리보기(서버가 앞의 2건만 준다)
export function getSearchPreview(
  response: SearchResponse,
  category: SearchCategory,
): SearchCategoryEntries {
  switch (category) {
    case "events":
      return { category, items: response.events.content };
    case "notices":
      return { category, items: response.notices.content };
    case "feedbacks":
      return { category, items: response.feedbacks.content };
    case "billilge":
      return { category, items: response.items.content };
    case "archives":
      return { category, items: response.archives.content };
  }
}

// 탭명에 붙는 결과 수(화면설계서 6번) — 서버가 센 전체 수라 미리보기 2건과 상관없다. 전체 탭은 모든 섹션의 합이다.
export function getSearchResultCount(
  response: SearchResponse,
  tab: SearchTab,
): number {
  if (tab === "all") {
    return response.totalCount;
  }
  return response[SEARCH_RESPONSE_SECTIONS[tab]].totalCount;
}
