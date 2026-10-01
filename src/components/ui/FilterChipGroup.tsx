import { Typography } from "@wanteddev/wds";

export interface FilterChipOption {
  value: string;
  label: string;
}

// 칩 하나의 스타일 — 이 행에 끼어드는 다른 칩(아카이빙 연도 필터의 드롭다운 트리거처럼 칩 모양이지만
// 클릭 동작이 다른 것)도 같은 모양으로 그릴 수 있도록 내보낸다. 라벨은 Typography로 감싸 쓴다.
export function getFilterChipClassName(isActive: boolean) {
  return isActive
    ? "inline-flex h-8 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[20px] border border-primary bg-primary-subtle px-3"
    : "inline-flex h-8 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[20px] border border-line-normal-neutral px-3";
}

interface FilterChipGroupProps {
  options: readonly FilterChipOption[];
  value: string;
  onChange: (value: string) => void;
}

// Figma: Filter Chips (빌릴게 1243:73337, 행사 1243:70861) — 원본이 같은 Stream 로컬 칩(1016:55355)이다.
// WDS `Chip`이 아니다: WDS Chip의 활성 스타일은 검정 배경이라 Figma(연한 파랑 배경 + 파랑 outline +
// 파랑 텍스트)와 다르다. wds-component-usage.md "빌릴게 필터 Chip은 WDS Chip/Chip이 아니었다" 참고.
//
// 빌릴게(카테고리)와 행사(모집 상태) 두 화면이 같은 칩 행을 쓰는 게 Figma에서 확인돼
// component-convention.md §1("두 번째 화면에서 실제로 재사용될 때 components/ui/로 옮긴다")대로 공용으로 뺐다.
// 가로 스크롤되는 단일 선택 행이 재사용 단위라 칩 하나가 아니라 행 전체를 컴포넌트로 둔다.
function FilterChipGroup({ options, value, onChange }: FilterChipGroupProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            className={getFilterChipClassName(active)}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <Typography
              color={
                active
                  ? "semantic.primary.normal"
                  : "semantic.label.alternative"
              }
              variant="caption1"
              weight={active ? "bold" : "medium"}
            >
              {option.label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}

export default FilterChipGroup;
