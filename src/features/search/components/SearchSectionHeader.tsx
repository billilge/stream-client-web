import { Typography } from "@wanteddev/wds";

interface SearchSectionHeaderProps {
  title: string;
  /** 있을 때만 오른쪽에 텍스트 버튼을 둔다 — 최근 검색어의 "전체 삭제" */
  actionLabel?: string;
  onAction?: () => void;
}

// Figma: Section Header (nodeId 3147:138663 "텍스트버튼" variant, 결과 화면은 제목만) — Stream 로컬
// 컴포넌트(wds-component-usage.md "제외됨" 표의 `Section-header`). 높이 24, 제목은 Headline 2/Bold.
function SearchSectionHeader({
  title,
  actionLabel,
  onAction,
}: SearchSectionHeaderProps) {
  return (
    <div className="flex h-6 w-full items-center justify-between">
      <Typography
        as="h2"
        color="semantic.label.normal"
        variant="headline2"
        weight="bold"
      >
        {title}
      </Typography>
      {actionLabel && (
        <button onClick={onAction} type="button">
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            {actionLabel}
          </Typography>
        </button>
      )}
    </div>
  );
}

export default SearchSectionHeader;
