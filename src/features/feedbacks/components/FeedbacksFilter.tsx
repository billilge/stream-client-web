import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuTrigger,
} from "@wanteddev/wds";
import { IconChevronDown } from "@wanteddev/wds-icon";
import { useState } from "react";

import FilterChip from "@/components/ui/FilterChip";
import {
  FEEDBACK_FILTER_ALL,
  FEEDBACK_ROUNDS,
} from "@/features/feedbacks/constants/feedbacks";

interface FeedbacksFilterProps {
  /** 메뉴에 보여줄 연도(최신순) */
  years: readonly string[];
  year: string;
  round: string;
  /** 메뉴에서 연도를 고르면 차수는 전체로 돌아간다 */
  onYearChange: (year: string) => void;
  onRoundChange: (round: string) => void;
}

// Figma: 게시판 - 열린피드백 드롭다운 있을 경우 (nodeId 1524:167569) — Filter Chips (1524:167589),
// 연도 메뉴 (1524:167867, WDS Menu). 칩은 공용 FilterChip이다.
//
// 첫 칩은 "전체 차수" 칩이면서 연도 메뉴의 트리거다. 연도를 고르면 라벨이 그 연도로 바뀌고,
// 1~4차 칩은 고른 연도 안에서 거른다. 연도가 걸려 있으면 차수를 골라도 첫 칩을 활성으로 둬서
// 지금 걸린 조건이 모두 칩으로 보이게 한다.
// Figma 메뉴에는 없지만 모든 연도로 되돌릴 수 있게 메뉴 맨 위에 "전체"를 둔다.
//
// 드롭다운 트리거가 섞인 행이라 FilterChipGroup 대신 FilterChip을 직접 나열한다(아카이빙 연도 필터와 같은 이유).
// 칩 사이는 Figma 열린피드백 두 화면(1410:50031, 1524:167589) 모두 8px이라 다른 칩 행(6px)과 달리 gap-2다.
function FeedbacksFilter({
  years,
  year,
  round,
  onYearChange,
  onRoundChange,
}: FeedbacksFilterProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAllYears = year === FEEDBACK_FILTER_ALL;

  // WDS Menu는 항목을 골라도 스스로 닫히지 않아서, 선택과 동시에 직접 닫는다.
  const handleYearChange = (value?: string | string[]) => {
    if (typeof value === "string") {
      onYearChange(value);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex gap-2 overflow-x-auto">
      <Menu
        onOpenChange={setIsMenuOpen}
        onValueChange={handleYearChange}
        open={isMenuOpen}
        value={year}
      >
        <MenuTrigger>
          <FilterChip
            isActive={!isAllYears || round === FEEDBACK_FILTER_ALL}
            trailing={<IconChevronDown className="size-3.5" />}
          >
            {isAllYears ? "전체" : year}
          </FilterChip>
        </MenuTrigger>
        {/* Menu 기본 너비(320px)가 Figma(150px)보다 넓어서 너비만 맞춘다.
            항목은 Figma "Cell Padding=8px" variant라 verticalPadding을 small(8px)로 준다 — 기본값 medium(12px)이면 48px로 커진다. */}
        <MenuContent offset={8} position="bottom-start" sx={{ width: 150 }}>
          <MenuList>
            <MenuItem value={FEEDBACK_FILTER_ALL} verticalPadding="small">
              전체
            </MenuItem>
            {years.map((item) => (
              <MenuItem key={item} value={item} verticalPadding="small">
                {item}
              </MenuItem>
            ))}
          </MenuList>
        </MenuContent>
      </Menu>

      {FEEDBACK_ROUNDS.map((item) => (
        <FilterChip
          isActive={item === round}
          key={item}
          onClick={() => onRoundChange(item)}
        >
          {item}
        </FilterChip>
      ))}
    </div>
  );
}

export default FeedbacksFilter;
