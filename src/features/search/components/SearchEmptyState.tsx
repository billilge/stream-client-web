import emptySearchIllustration from "@/assets/icons/search/empty-search.svg";
import EmptyState from "@/components/ui/EmptyState";

// Figma: 검색 결과 empty state > Empty State (nodeId 3147:138778).
// 결과가 하나도 없을 때와 탭에 결과가 없을 때 두 곳이 같은 문구라 공용 EmptyState를 감싸 둔다.
function SearchEmptyState() {
  return (
    <EmptyState
      description="다른 키워드로 검색해 보세요."
      illustration={emptySearchIllustration}
      title="검색 결과가 없어요"
    />
  );
}

export default SearchEmptyState;
