import FilterChipGroup, {
  type FilterChipOption,
} from "@/components/ui/FilterChipGroup";

const BILILGE_CATEGORIES: readonly FilterChipOption[] = [
  { label: "전체", value: "전체" },
  { label: "전자기기", value: "전자기기" },
  { label: "생활잡화", value: "생활잡화" },
  { label: "상비약", value: "상비약" },
  { label: "위생용품", value: "위생용품" },
];

interface BililgeCategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

// Figma: 빌릴게 Filter Row (nodeId 1243:73337) — 칩 자체는 행사 화면과 공유하는 FilterChipGroup을 쓴다.
// 실제 목록 필터링은 BililgeListScreen이 BILILGE_ITEMS의 category 필드를 기준으로 한다
// (bililgeItems.ts 참고) — 이 컴포넌트는 선택 상태 표시·onChange 전달만 맡는다.
function BililgeCategoryFilter({
  value,
  onChange,
}: BililgeCategoryFilterProps) {
  return (
    <FilterChipGroup
      onChange={onChange}
      options={BILILGE_CATEGORIES}
      value={value}
    />
  );
}

export default BililgeCategoryFilter;
