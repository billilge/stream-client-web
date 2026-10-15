import { ARCHIVES } from "@/entities/archives/archivesMock";
import { BILILGE_ITEMS } from "@/entities/bililge/bililgeMock";
import { EVENTS } from "@/entities/events/eventsMock";
import { FEEDBACKS } from "@/entities/feedbacks/feedbacksMock";
import { NOTICES } from "@/entities/notices/noticesMock";
import type { SearchResults } from "@/entities/search/types";
import { mockupApi } from "@/lib/mockupApi";

function includesKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword);
}

// 목데이터 기준 클라이언트 검색이다 — 제목류 필드만 대소문자 무시 부분 일치로 본다.
// 공지·행사 본문은 목데이터가 전부 같은 글이라 본문까지 보면 아무 키워드나 전부 걸린다.
function searchMocks(keyword: string): SearchResults {
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

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다(`/api/search`) — 화면은 이 함수로만 데이터를 받는다.
// 열린피드백은 아직 entities로 옮겨지지 않아 features의 목데이터를 직접 읽는다.
export function fetchSearchResults(rawKeyword: string): Promise<SearchResults> {
  const keyword = rawKeyword.trim().toLowerCase();
  return mockupApi(`search/${keyword}`, () => searchMocks(keyword));
}
