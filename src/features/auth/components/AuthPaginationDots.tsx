interface AuthPaginationDotsProps {
  totalPages: number;
  /** 0부터 센다 */
  currentPage: number;
  onSelect: (page: number) => void;
}

// Figma: Pagination/Dots (nodeId 3658:113073) — Stream 로컬 컴포넌트다. 이름은 WDS `PaginationDots`와
// 같지만 크기가 달라서 쓰지 않았다: Figma 닷은 지름 6px·간격 6px(중심 간격 12px)인데, WDS는 `small`이
// 8px·간격 8px(16px), `medium`이 10px이고 닷 크기를 CSS 변수로만 바꿀 수 있어 내부 오버라이드가 된다.
// 현재 닷은 Label/Normal, 나머지는 같은 색의 16% 불투명도다.
function AuthPaginationDots({
  totalPages,
  currentPage,
  onSelect,
}: AuthPaginationDotsProps) {
  return (
    <nav aria-label="소개 슬라이드" className="flex items-center gap-1.5">
      {Array.from({ length: totalPages }, (_, page) => (
        <button
          aria-current={page === currentPage}
          aria-label={`${page + 1}번째 소개 보기`}
          // 6px 닷은 누르기 어려워서 보이지 않는 영역만 사방으로 8px 넓힌다(배치는 그대로)
          className={`relative size-1.5 rounded-full after:absolute after:-inset-2 ${
            page === currentPage ? "bg-label-normal" : "bg-label-normal/16"
          }`}
          // biome-ignore lint/suspicious/noArrayIndexKey: 닷은 개수가 고정이고 순서가 곧 식별자다
          key={page}
          onClick={() => onSelect(page)}
          type="button"
        />
      ))}
    </nav>
  );
}

export default AuthPaginationDots;
