import FilterChip from "@/components/ui/FilterChip";

export interface FilterChipOption {
  value: string;
  label: string;
}

interface FilterChipGroupProps {
  options: readonly FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
}

// Figma: Filter Chips (빌릴게 1243:73337, 행사 1243:70861) — 원본이 같은 Stream 로컬 칩(1016:55355)이다.
// 칩 하나의 모양은 FilterChip이 들고 있고, 여기는 "가로 스크롤되는 단일 선택 행"만 담당한다.
//
// 빌릴게(카테고리)와 행사(모집 상태) 두 화면이 같은 칩 행을 쓰는 게 Figma에서 확인돼
// component-convention.md §1("두 번째 화면에서 실제로 재사용될 때 components/ui/로 옮긴다")대로 공용으로 뺐다.
// 선택 동작이 다른 칩이 섞이는 행(아카이빙 연도 필터)은 이 컴포넌트 대신 FilterChip을 직접 나열한다.
function FilterChipGroup({ options, value, onChange }: FilterChipGroupProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {options.map((option) => (
        <FilterChip
          aria-pressed={option.value === value}
          isActive={option.value === value}
          key={option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}

export default FilterChipGroup;
