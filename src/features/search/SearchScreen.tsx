import { Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SearchHeader from "@/features/search/components/SearchHeader";
import SearchRecentList from "@/features/search/components/SearchRecentList";
import SearchResultContent from "@/features/search/components/SearchResultContent";
import SearchResultSkeleton from "@/features/search/components/SearchResultSkeleton";
import {
  isSearchTab,
  type SearchTab,
} from "@/features/search/constants/search";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";

// Figma: 검색 (nodeId 1879:90575) — 검색 진입(3147:138646) / 검색 중(3147:138670) /
// 검색 완료(3147:138695, 3147:138745) / 검색 결과 empty state(3147:138770). 동작은 화면설계서
// (nodeId 3147:135502, 화면 ID FLW_HOM_001) 기준이다.
//
// 상태 흐름: 입력 비어 있음(진입) · 입력 중(검색 중) → 최근 검색어를 보여주고, 제출하면 응답 대기
// (스켈레톤) → 결과(또는 empty). 입력을 다시 고치면 결과를 걷고 최근 검색어로 돌아간다.
// 결과는 SearchResultContent가 use(fetchSearchResults())로 읽고, 응답 대기는 Suspense가 스켈레톤으로 받는다.
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
  // 제출한 검색어 — null이면 아직 검색 전(또는 검색어를 고치는 중)이라 최근 검색어를 보여준다
  const [keyword, setKeyword] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);

  // 화면에 들어오면 바로 입력할 수 있게 포커스한다(Figma "검색 중" 프레임에 키보드가 올라와 있다).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (rawKeyword: string) => {
    const trimmed = rawKeyword.trim();
    if (!trimmed) {
      return;
    }
    setInputValue(trimmed);
    addRecentSearch(trimmed);
    setActiveTab(initialTab);
    setKeyword(trimmed);
    // 결과를 보기 전에 키보드를 내려서 화면을 가리지 않게 한다
    inputRef.current?.blur();
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    // 검색어를 고치기 시작하면 이전 결과는 걷고 최근 검색어로 돌아간다
    setKeyword(null);
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

      {/* 진입·검색 중: Figma는 헤더 아래 8px 띄우고 "최근 검색어"가 시작한다 */}
      {keyword === null ? (
        <div className="scrollbar-hidden flex-1 overflow-y-auto pt-2">
          <SearchRecentList
            keywords={recentSearches}
            onClear={clearRecentSearches}
            onRemove={removeRecentSearch}
            onSelect={submit}
          />
        </div>
      ) : (
        <Suspense fallback={<SearchResultSkeleton />}>
          <SearchResultContent
            activeTab={activeTab}
            keyword={keyword}
            onTabChange={setActiveTab}
          />
        </Suspense>
      )}
    </>
  );
}

export default SearchScreen;
