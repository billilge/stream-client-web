import FilterChipGroup, {
  type FilterChipOption,
} from "@/components/ui/FilterChipGroup";
import {
  BILLILGE_ALL_CATEGORIES,
  BILLILGE_CATEGORY_LABELS,
  type BillilgeCategoryFilterValue,
} from "@/features/billilge/constants/billilge";

const BILLILGE_CATEGORIES: readonly FilterChipOption[] = [
  { label: "전체", value: BILLILGE_ALL_CATEGORIES },
  ...Object.entries(BILLILGE_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value,
  })),
];

function isCategoryFilterValue(
  value: string,
): value is BillilgeCategoryFilterValue {
  return BILLILGE_CATEGORIES.some((option) => option.value === value);
}

interface BillilgeCategoryFilterProps {
  value: BillilgeCategoryFilterValue;
  onChange: (category: BillilgeCategoryFilterValue) => void;
}

// Figma: 빌릴게 Filter Row (nodeId 1243:73337) — 칩 자체는 행사 화면과 공유하는 FilterChipGroup을 쓴다.
// 칩 값은 서버 물품 분류(ItemCategory)라 목록이 그 값으로 거른다 — 이 컴포넌트는 선택 상태 표시·onChange 전달만 맡는다.
function BillilgeCategoryFilter({
  value,
  onChange,
}: BillilgeCategoryFilterProps) {
  return (
    <FilterChipGroup
      onChange={(next) => {
        if (isCategoryFilterValue(next)) {
          onChange(next);
        }
      }}
      options={BILLILGE_CATEGORIES}
      value={value}
    />
  );
}

export default BillilgeCategoryFilter;
