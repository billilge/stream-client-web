import { Typography } from "@wanteddev/wds";

const BILILGE_CATEGORIES = [
  "전체",
  "전자기기",
  "생활잡화",
  "상비약",
  "위생용품",
];

interface BililgeCategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

// Figma: 빌릴게 Filter Row (nodeId 1243:73337) — WDS Chip이 아니라 Stream 로컬 커스텀 칩.
// 카테고리·물품 매핑 API가 아직 없어 필터링 없이 선택 상태만 표시한다.
function BililgeCategoryFilter({
  value,
  onChange,
}: BililgeCategoryFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {BILILGE_CATEGORIES.map((category) => {
        const active = category === value;
        return (
          <button
            className={
              active
                ? "shrink-0 whitespace-nowrap rounded-[20px] border border-primary bg-primary-subtle px-3 py-2"
                : "shrink-0 whitespace-nowrap rounded-[20px] border border-line-normal-neutral px-3 py-2"
            }
            key={category}
            onClick={() => onChange(category)}
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
              {category}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}

export default BililgeCategoryFilter;
