import { Typography } from "@wanteddev/wds";

import emptySearchIllustration from "@/assets/icons/search/empty-search.svg";

// Figma: 검색 결과 empty state > Empty State (nodeId 3147:138778) — Stream 로컬 컴포넌트.
// 행사 empty(EventsEmptyState)와 일러스트가 다르고 설명이 Medium이 아니라 Regular라서 따로 둔다.
// 일러스트는 80×80, 컨테이너 203px, 일러스트–문구 간격 12, 타이틀–설명 간격 4.
function SearchEmptyState() {
  return (
    <div className="flex w-[203px] flex-col items-center gap-3">
      <img alt="" className="size-20 shrink-0" src={emptySearchIllustration} />
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <Typography
          align="center"
          color="semantic.label.neutral"
          variant="headline1"
          weight="bold"
        >
          검색 결과가 없어요
        </Typography>
        <Typography
          align="center"
          color="semantic.label.alternative"
          variant="label1"
          weight="regular"
        >
          다른 키워드로 검색해 보세요.
        </Typography>
      </div>
    </div>
  );
}

export default SearchEmptyState;
