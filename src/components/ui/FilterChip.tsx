import { Typography } from "@wanteddev/wds";
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
  /** 라벨 뒤에 붙는 요소 — 아카이빙 연도 드롭다운 트리거의 chevron 아이콘 */
  trailing?: ReactNode;
  children: ReactNode;
}

// Figma: Chip (nodeId 1016:55355 active / 1016:55354 default) — WDS `Chip`이 아니다.
// WDS Chip의 활성 스타일은 검정 배경이라 Figma(연한 파랑 배경 + 파랑 outline + 파랑 텍스트)와
// 다르다. wds-component-usage.md "빌릴게 필터 Chip은 WDS Chip/Chip이 아니었다" 참고.
//
// 칩 하나만 따로 두는 이유: 단일 선택 행(FilterChipGroup)뿐 아니라, 같은 행에 섞이는 다른 동작의
// 칩(아카이빙 연도 필터의 드롭다운 트리거)도 같은 모양이어야 한다. WDS `MenuTrigger`가 자식에게
// onClick·aria 속성을 넘겨주므로 ref와 나머지 props를 그대로 button에 전달한다.
const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ isActive, trailing, children, ...props }, ref) => (
    <button
      className={
        isActive
          ? "inline-flex h-8 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[20px] border border-primary bg-primary-subtle px-3"
          : "inline-flex h-8 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-[20px] border border-line-normal-neutral px-3"
      }
      ref={ref}
      type="button"
      {...props}
    >
      <Typography
        color={
          isActive ? "semantic.primary.normal" : "semantic.label.alternative"
        }
        variant="caption1"
        weight={isActive ? "bold" : "medium"}
      >
        {children}
      </Typography>
      {trailing}
    </button>
  ),
);

FilterChip.displayName = "FilterChip";

export default FilterChip;
