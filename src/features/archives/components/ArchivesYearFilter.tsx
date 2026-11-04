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

// 최신 연도 몇 개만 칩으로 두고 나머지는 "~{연도}" 드롭다운에 모은다
const RECENT_YEAR_COUNT = 3;

interface ArchivesYearFilterProps {
  /** 서버가 내려 주는 연도 — 최신순 */
  years: number[];
  value: number;
  onChange: (year: number) => void;
}

// Figma: 아카이빙 목록 Filter Row (nodeId 1276:95404) — 칩은 빌릴게·행사와 같은 공용 FilterChip이다.
// 단일 선택 칩 사이에 드롭다운 트리거가 섞인 행이라 FilterChipGroup(단일 선택 전용 행) 대신
// FilterChip을 직접 나열해서 행 컨테이너를 하나만 둔다.
// 이전 연도 드롭다운(nodeId 1529:172188)은 WDS Menu.
function ArchivesYearFilter({
  years,
  value,
  onChange,
}: ArchivesYearFilterProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const recentYears = years.slice(0, RECENT_YEAR_COUNT);
  const olderYears = years.slice(RECENT_YEAR_COUNT);
  const isOlderYearSelected = olderYears.includes(value);

  // WDS Menu는 항목을 골라도 스스로 닫히지 않아서, 선택과 동시에 직접 닫는다.
  const handleOlderYearChange = (year?: string | string[]) => {
    if (typeof year === "string") {
      onChange(Number(year));
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {recentYears.map((year) => (
        <FilterChip
          aria-pressed={year === value}
          isActive={year === value}
          key={year}
          onClick={() => onChange(year)}
        >
          {year}
        </FilterChip>
      ))}

      {olderYears.length > 0 && (
        <Menu
          onOpenChange={setIsMenuOpen}
          onValueChange={handleOlderYearChange}
          open={isMenuOpen}
          value={String(value)}
        >
          <MenuTrigger>
            {/* 이전 연도를 고르면 "~2023" 대신 고른 연도를 보여준다 */}
            <FilterChip
              isActive={isOlderYearSelected}
              trailing={<IconChevronDown className="size-3.5" />}
            >
              {isOlderYearSelected ? value : `~${olderYears[0]}`}
            </FilterChip>
          </MenuTrigger>
          {/* Menu 기본 너비(320px)가 Figma(150px)보다 넓어서 너비만 맞춘다 */}
          <MenuContent offset={8} position="bottom-start" sx={{ width: 150 }}>
            <MenuList>
              {olderYears.map((year) => (
                <MenuItem key={year} value={String(year)}>
                  {year}
                </MenuItem>
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      )}
    </div>
  );
}

export default ArchivesYearFilter;
