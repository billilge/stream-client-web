import { use } from "react";

import { fetchSearchResults } from "@/entities/search/searchApi";
import SearchEmptyState from "@/features/search/components/SearchEmptyState";
import SearchResultView from "@/features/search/components/SearchResultView";
import {
  getSearchResultCount,
  type SearchTab,
} from "@/features/search/constants/search";

interface SearchResultContentProps {
  keyword: string;
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

// 검색 결과를 use()로 읽는 데이터 컴포넌트 — 응답을 기다리는 동안은 바깥 Suspense가 스켈레톤을 보여준다.
function SearchResultContent({
  keyword,
  activeTab,
  onTabChange,
}: SearchResultContentProps) {
  const results = use(fetchSearchResults(keyword));

  // 전체 결과가 하나도 없으면 탭 없이 empty만 보여준다(Figma empty 프레임에 탭이 없다)
  if (getSearchResultCount(results, "all") === 0) {
    return (
      <div className="flex flex-1 items-center justify-center pb-[60px]">
        <SearchEmptyState />
      </div>
    );
  }

  return (
    <SearchResultView
      activeTab={activeTab}
      onTabChange={onTabChange}
      results={results}
    />
  );
}

export default SearchResultContent;
