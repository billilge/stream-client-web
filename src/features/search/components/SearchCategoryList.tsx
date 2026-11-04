import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import SearchCategoryItems from "@/features/search/components/SearchCategoryItems";
import type {
  SearchCategory,
  SearchCategoryEntries,
} from "@/features/search/constants/search";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { archivesQueries } from "@/shared/entities/archives/archivesQueries";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";
import { eventsQueries } from "@/shared/entities/events/eventsQueries";
import { feedbacksQueries } from "@/shared/entities/feedbacks/feedbacksQueries";
import { noticesQueries } from "@/shared/entities/notices/noticesQueries";

interface SearchCategoryListProps {
  category: SearchCategory;
  keyword: string;
}

interface CategoryListProps {
  keyword: string;
}

// 개별 탭의 전체 결과 — 통합 검색은 섹션마다 2건만 줘서, 탭은 각 목록 API에 keyword를 넘겨 그 목록의 순서·페이지
// 방식 그대로 받는다(서버 #263). 받는 동안은 SearchResultView의 Suspense가 스켈레톤을 보여준다.
// 카테고리마다 조회 훅이 달라서(커서·페이지 번호·한 번에) 카테고리별 컴포넌트로 나눈다.
function SearchCategoryList({ category, keyword }: SearchCategoryListProps) {
  switch (category) {
    case "events":
      return <SearchEventsList keyword={keyword} />;
    case "notices":
      return <SearchNoticesList keyword={keyword} />;
    case "feedbacks":
      return <SearchFeedbacksList keyword={keyword} />;
    case "billilge":
      return <SearchBillilgeList keyword={keyword} />;
    case "archives":
      return <SearchArchivesList keyword={keyword} />;
  }
}

// 이어 받는 목록의 카드와, 보이면 다음 페이지를 받는 끝 요소
// query는 조회 결과를 펼치지 않고 그대로 받는다 — 펼치면 TanStack Query가 모든 필드를 쓰는 것으로 보고 다시 그린다
function InfiniteEntries({
  entries,
  query,
}: {
  entries: SearchCategoryEntries;
  query: Parameters<typeof useInfiniteScroll>[0];
}) {
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchNextPageError: query.isFetchNextPageError,
    isFetchingNextPage: query.isFetchingNextPage,
  });

  return (
    <>
      <SearchCategoryItems entries={entries} />
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </>
  );
}

function SearchEventsList({ keyword }: CategoryListProps) {
  const query = useSuspenseInfiniteQuery({
    ...eventsQueries.list(null, keyword),
    select: (response) => response.pages.flatMap((page) => page.content),
  });
  return (
    <InfiniteEntries
      entries={{ category: "events", items: query.data }}
      query={query}
    />
  );
}

function SearchNoticesList({ keyword }: CategoryListProps) {
  const query = useSuspenseInfiniteQuery({
    ...noticesQueries.list(null, keyword),
    select: (response) => response.pages.flatMap((page) => page.content),
  });
  return (
    <InfiniteEntries
      entries={{ category: "notices", items: query.data }}
      query={query}
    />
  );
}

function SearchFeedbacksList({ keyword }: CategoryListProps) {
  const query = useSuspenseInfiniteQuery({
    ...feedbacksQueries.list(null, null, keyword),
    select: (response) => response.pages.flatMap((page) => page.content),
  });
  return (
    <InfiniteEntries
      entries={{ category: "feedbacks", items: query.data }}
      query={query}
    />
  );
}

function SearchBillilgeList({ keyword }: CategoryListProps) {
  const query = useSuspenseInfiniteQuery({
    ...billilgeQueries.items(null, keyword),
    select: (response) => response.pages.flatMap((page) => page.content),
  });
  return (
    <InfiniteEntries
      entries={{ category: "billilge", items: query.data }}
      query={query}
    />
  );
}

// 아카이빙 목록은 페이지 없이 한 번에 온다(연도를 넘기지 않아 모든 연도에서 찾는다)
function SearchArchivesList({ keyword }: CategoryListProps) {
  const { data } = useSuspenseQuery({
    ...archivesQueries.list(keyword),
    select: (response) => response.archives,
  });
  return (
    <SearchCategoryItems entries={{ category: "archives", items: data }} />
  );
}

export default SearchCategoryList;
