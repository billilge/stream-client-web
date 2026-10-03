import { Typography } from "@wanteddev/wds";
import { IconClock, IconClose } from "@wanteddev/wds-icon";

import SearchSectionHeader from "@/features/search/components/SearchSectionHeader";

interface SearchRecentListProps {
  keywords: string[];
  onSelect: (keyword: string) => void;
  onRemove: (keyword: string) => void;
  onClear: () => void;
}

// Figma: 검색 진입 > 최근 검색어 (nodeId 3147:138662) — 섹션 헤더("전체 삭제") + RecentSearch List 행들.
// 행은 시계 아이콘 + 검색어(누르면 그 검색어로 다시 검색)와 오른쪽 닫기 아이콘(개별 삭제)이다.
// Clock/Close 아이콘은 WDS(`Icon/Normal/Clock`·`Icon/Normal/Close`, 설명 문서 확인)라 그대로 쓴다.
// 검색어가 하나도 없으면 섹션째 그리지 않는다(Figma에 빈 상태 디자인이 없다).
function SearchRecentList({
  keywords,
  onSelect,
  onRemove,
  onClear,
}: SearchRecentListProps) {
  if (keywords.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3 px-5">
      <SearchSectionHeader
        actionLabel="전체 삭제"
        onAction={onClear}
        title="최근 검색어"
      />
      <ul className="flex flex-col gap-4">
        {keywords.map((keyword) => (
          <li className="flex items-center justify-between" key={keyword}>
            <button
              className="flex min-w-0 items-center gap-2 text-left"
              onClick={() => onSelect(keyword)}
              type="button"
            >
              <IconClock className="size-[18px] shrink-0 text-label-assistive" />
              <Typography
                color="semantic.label.neutral"
                noWrap
                variant="label1"
                weight="regular"
              >
                {keyword}
              </Typography>
            </button>
            <button
              aria-label={`${keyword} 삭제`}
              className="flex shrink-0 text-label-assistive"
              onClick={() => onRemove(keyword)}
              type="button"
            >
              <IconClose className="size-[18px]" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SearchRecentList;
