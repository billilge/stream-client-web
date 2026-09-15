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
// 카테고리·물품 매핑 API가 아직 없어 필터링 없이 선택 상태만 표시한다.
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
