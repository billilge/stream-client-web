import { Button, Tab, TabList, TabListItem } from "@wanteddev/wds";
import { IconChevronRight } from "@wanteddev/wds-icon";
import { Fragment } from "react";

import type { SearchResults } from "@/entities/search/types";
import SearchCategoryItems from "@/features/search/components/SearchCategoryItems";
import SearchEmptyState from "@/features/search/components/SearchEmptyState";
import SearchSectionHeader from "@/features/search/components/SearchSectionHeader";
import {
  getSearchResultCount,
  getSearchTabLabel,
  isSearchTab,
  SEARCH_ALL_TAB_PREVIEW_COUNT,
  SEARCH_ALL_TAB_SECTIONS,
  SEARCH_CATEGORY_LABELS,
  SEARCH_TABS,
  type SearchTab,
} from "@/features/search/constants/search";

interface SearchResultViewProps {
  results: SearchResults;
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

// Figma: 검색 완료 - 모든 검색 UI(nodeId 3147:138695) / 행사 탭(3147:138745)
// 탭은 결과 수를 같이 보여주고(설계서 6번 "행사 8"), 6개라 375px을 넘으면 WDS TabList가
// 가로 스크롤한다. 탭 줄은 고정하고(shrink-0) 아래 목록만 세로 스크롤한다.
function SearchResultView({
  results,
  activeTab,
  onTabChange,
}: SearchResultViewProps) {
  const activeCount = getSearchResultCount(results, activeTab);
  const visibleSections = SEARCH_ALL_TAB_SECTIONS.filter(
    (category) => results[category].length > 0,
  );

  return (
    <>
      <div className="shrink-0">
        <Tab
          onValueChange={(value) => {
            if (isSearchTab(value)) {
              onTabChange(value);
            }
          }}
          value={activeTab}
        >
          {/* size="small"(Body 2/Bold 15px, 세로 패딩 9 → 높이 40)과 horizontalPadding(좌우 20, 스크롤은
              화면 끝까지)이 Figma 탭 줄(nodeId 3147:138705: 높이 40, 좌우 20, 탭 간격 24)과 일치한다 */}
          <TabList horizontalPadding size="small">
            {SEARCH_TABS.map((tab) => (
              <TabListItem key={tab} value={tab}>
                {getSearchTabLabel(tab)} {getSearchResultCount(results, tab)}
              </TabListItem>
            ))}
          </TabList>
        </Tab>
      </div>

      {/* 탭을 바꾸면 스크롤 위치가 맨 위로 돌아가도록 key로 새로 그린다 */}
      <div className="scrollbar-hidden flex-1 overflow-y-auto" key={activeTab}>
        {activeCount === 0 ? (
          // 다른 empty 화면과 같이 Figma 프레임 전체 높이 기준 가운데(헤더 60px만큼 올려서) 맞춘다.
          <div className="flex h-full items-center justify-center pb-[60px]">
            <SearchEmptyState />
          </div>
        ) : activeTab === "all" ? (
          // 섹션 사이는 위아래 간격 32 + 8px 회색 띠(Divider(new) 8px)다
          <div className="flex flex-col gap-8 pt-3 pb-8">
            {visibleSections.map((category, index) => {
              const hiddenCount =
                results[category].length - SEARCH_ALL_TAB_PREVIEW_COUNT;
              return (
                <Fragment key={category}>
                  {index > 0 && (
                    <div className="h-2 w-full bg-background-alternative" />
                  )}
                  <section className="flex flex-col gap-3">
                    <div className="px-5">
                      <SearchSectionHeader
                        title={SEARCH_CATEGORY_LABELS[category]}
                      />
                    </div>
                    <SearchCategoryItems
                      category={category}
                      footer={
                        hiddenCount > 0 && (
                          // 설계서 5번: 눌러서 해당 카테고리 탭으로 이동해 전체 목록을 본다
                          <div className="flex justify-center">
                            <Button
                              color="assistive"
                              onClick={() => onTabChange(category)}
                              size="small"
                              trailingContent={<IconChevronRight />}
                              variant="outlined"
                            >
                              {hiddenCount}개 더보기
                            </Button>
                          </div>
                        )
                      }
                      limit={SEARCH_ALL_TAB_PREVIEW_COUNT}
                      results={results}
                    />
                  </section>
                </Fragment>
              );
            })}
          </div>
        ) : (
          <div className="pt-3 pb-8">
            <SearchCategoryItems category={activeTab} results={results} />
          </div>
        )}
      </div>
    </>
  );
}

export default SearchResultView;
