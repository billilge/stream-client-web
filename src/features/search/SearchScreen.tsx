import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchEmptyState from "@/features/search/components/SearchEmptyState";
import SearchHeader from "@/features/search/components/SearchHeader";
import SearchRecentList from "@/features/search/components/SearchRecentList";
import SearchResultSkeleton from "@/features/search/components/SearchResultSkeleton";
import SearchResultView from "@/features/search/components/SearchResultView";
import {
  getSearchResultCount,
  isSearchTab,
  SEARCH_MOCK_DELAY_MS,
  type SearchResults,
  type SearchTab,
  searchAll,
} from "@/features/search/constants/search";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";

// 제출할 때마다 새 객체를 만든다 — 같은 검색어를 연달아 제출해도 결과 조회 이펙트가 다시 돌게 하려는 것이다.
interface SearchRequest {
  keyword: string;
}

// Figma: 검색 (nodeId 1879:90575) — 검색 진입(3147:138646) / 검색 중(3147:138670) /
// 검색 완료(3147:138695, 3147:138745) / 검색 결과 empty state(3147:138770). 동작은 화면설계서
// (nodeId 3147:135502, 화면 ID FLW_HOM_001) 기준이다.
//
// 상태 흐름: 입력 비어 있음(진입) · 입력 중(검색 중) → 최근 검색어를 보여주고, 제출하면 응답 대기
// (스켈레톤) → 결과(또는 empty). 입력을 다시 고치면 결과를 걷고 최근 검색어로 돌아간다.
// 홈·행사·게시판·빌릴게 헤더의 검색 아이콘이 `?tab=`으로 넘긴 탭을 결과의 시작 탭으로 쓴다
// (설계서 3번: 홈 검색은 전체 탭부터, 기능 내 검색은 해당 탭부터).
function SearchScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab: SearchTab = isSearchTab(requestedTab)
    ? requestedTab
    : "all";

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [request, setRequest] = useState<SearchRequest | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

  // 화면에 들어오면 바로 입력할 수 있게 포커스한다(Figma "검색 중" 프레임에 키보드가 올라와 있다).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 실 API 전까지는 목데이터를 SEARCH_MOCK_DELAY_MS 뒤에 돌려줘서 응답 대기 상태를 흉내 낸다.
  useEffect(() => {
    if (!request) {
      return;
    }
    const timer = window.setTimeout(() => {
      setResults(searchAll(request.keyword));
    }, SEARCH_MOCK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [request]);

  const isLoading = request !== null && results === null;

  const submit = (rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) {
      return;
    }
    setInputValue(keyword);
    addRecentSearch(keyword);
    setResults(null);
    setActiveTab(initialTab);
    setRequest({ keyword });
    // 결과를 보기 전에 키보드를 내려서 화면을 가리지 않게 한다
    inputRef.current?.blur();
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    // 검색어를 고치기 시작하면 이전 결과는 걷고 최근 검색어로 돌아간다(진행 중이던 조회도 취소)
    setRequest(null);
    setResults(null);
  };

  // 이 화면으로 바로 들어오면(딥링크·앱 WebView 진입) 뒤로 갈 히스토리가 없어서 navigate(-1)이
  // 아무 일도 하지 않는다 — 그럴 땐 홈으로 보낸다(행사 신청 화면의 goBack과 같은 규칙).
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <>
      <SearchHeader
        inputRef={inputRef}
        onBack={goBack}
        onChange={handleChange}
        onSubmit={() => submit(inputValue)}
        value={inputValue}
      />

      {isLoading && <SearchResultSkeleton />}

      {/* 진입·검색 중: Figma는 헤더 아래 8px 띄우고 "최근 검색어"가 시작한다 */}
      {!isLoading && results === null && (
        <div className="scrollbar-hidden flex-1 overflow-y-auto pt-2">
          <SearchRecentList
            keywords={recentSearches}
            onClear={clearRecentSearches}
            onRemove={removeRecentSearch}
            onSelect={submit}
          />
        </div>
      )}

      {results !== null &&
        (getSearchResultCount(results, "all") === 0 ? (
          // 전체 결과가 하나도 없으면 탭 없이 empty만 보여준다(Figma empty 프레임에 탭이 없다)
          <div className="flex flex-1 items-center justify-center pb-[60px]">
            <SearchEmptyState />
          </div>
        ) : (
          <SearchResultView
            activeTab={activeTab}
            onTabChange={setActiveTab}
            results={results}
          />
        ))}
    </>
  );
}

export default SearchScreen;
