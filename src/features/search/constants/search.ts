import {
  ARCHIVES,
  type ArchiveItem,
} from "@/features/archives/constants/archives";
import {
  BILILGE_ITEMS,
  type BililgeItem,
} from "@/features/bililge/constants/bililgeItems";
import { EVENTS, type EventItem } from "@/features/events/constants/events";
import {
  FEEDBACKS,
  type Feedback,
} from "@/features/feedbacks/constants/feedbacks";
import { NOTICES, type Notice } from "@/features/notices/constants/notices";

// 검색 결과 카테고리 — 키는 용어 사전(terminology.md)의 코드 용어를 그대로 쓴다.
export type SearchCategory =
  | "events"
  | "notices"
  | "feedbacks"
  | "bililge"
  | "archives";

export type SearchTab = "all" | SearchCategory;

export interface SearchResults {
  events: EventItem[];
  notices: Notice[];
  feedbacks: Feedback[];
  bililge: BililgeItem[];
  archives: ArchiveItem[];
}

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

// 실제 API가 붙기 전까지 "응답 대기 중 스켈레톤 UI"(화면설계서 8번)를 볼 수 있게 두는 가짜 지연.
export const SEARCH_MOCK_DELAY_MS = 600;

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

function includesKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword);
}

// 목데이터 기준 클라이언트 검색이다 — 제목류 필드만 대소문자 무시 부분 일치로 본다.
// 공지·행사 본문은 목데이터가 전부 같은 글이라 본문까지 보면 아무 키워드나 전부 걸린다.
export function searchAll(rawKeyword: string): SearchResults {
  const keyword = rawKeyword.trim().toLowerCase();
  if (!keyword) {
    return {
      archives: [],
      bililge: [],
      events: [],
      feedbacks: [],
      notices: [],
    };
  }
  return {
    archives: ARCHIVES.filter((item) => includesKeyword(item.title, keyword)),
    bililge: BILILGE_ITEMS.filter((item) =>
      includesKeyword(item.name, keyword),
    ),
    events: EVENTS.filter((item) => includesKeyword(item.title, keyword)),
    feedbacks: FEEDBACKS.filter((item) =>
      includesKeyword(item.question, keyword),
    ),
    notices: NOTICES.filter((item) => includesKeyword(item.title, keyword)),
  };
}
