import { Skeleton } from "@wanteddev/wds";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// 행 모양을 고정 개수만 그린다(실제 응답 건수를 아직 모른다).
const SKELETON_ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5"];
const SKELETON_TAB_KEYS = ["tab-1", "tab-2", "tab-3", "tab-4"];

// 화면설계서 8번 "응답 대기 중 스켈레톤 UI" — Figma에는 이 상태 프레임이 없어서 결과 화면의 뼈대
// (탭 줄 + 썸네일/두 줄 텍스트 행)를 WDS `Skeleton`으로 흉내 냈다. 모션 줄이기 설정이면 깜빡임을 끈다.
function SearchResultSkeleton() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation = !prefersReducedMotion;

  return (
    <div
      aria-busy="true"
      aria-label="검색 결과를 불러오는 중이에요"
      className="flex flex-col gap-6"
      role="status"
    >
      <div className="flex items-center gap-6 px-5 py-2.5">
        {SKELETON_TAB_KEYS.map((key) => (
          <Skeleton
            animation={animation}
            height={20}
            key={key}
            radius={6}
            variant="rectangle"
            width={48}
          />
        ))}
      </div>
      <div className="flex flex-col gap-5 px-5">
        {SKELETON_ROW_KEYS.map((key) => (
          <div className="flex items-center gap-3" key={key}>
            <Skeleton
              animation={animation}
              height={56}
              radius={8}
              variant="rectangle"
              width={56}
            />
            <div className="flex flex-col gap-2">
              <Skeleton
                animation={animation}
                height={18}
                radius={6}
                variant="rectangle"
                width={180}
              />
              <Skeleton
                animation={animation}
                height={14}
                radius={6}
                variant="rectangle"
                width={96}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResultSkeleton;
