import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuTrigger,
  Typography,
} from "@wanteddev/wds";
import { IconChevronDown } from "@wanteddev/wds-icon";
import { useState } from "react";

import FilterChipGroup, {
  getFilterChipClassName,
} from "@/components/ui/FilterChipGroup";

const RECENT_YEARS = ["2026", "2025", "2024"].map((year) => ({
  label: year,
  value: year,
}));
const OLDER_YEARS = ["2023", "2022", "2021", "2020"];
const OLDER_YEARS_LABEL = "~2023";

interface ArchivesYearFilterProps {
  value: string;
  onChange: (year: string) => void;
}

// Figma: 아카이빙 상세 Filter Row (nodeId 1276:95404) — 칩은 빌릴게·행사와 같은 모양이라 공용 FilterChipGroup을 쓴다.
// 드롭다운 트리거만 칩 행에 끼는 로컬 칩이다(선택 동작이 달라 FilterChipGroup의 단일 선택 행에 넣을 수 없다).
// 이전 연도 드롭다운(nodeId 1529:172188)은 WDS Menu. 연도별 앨범 API가 아직 없어 필터링 없이 선택 상태만 표시한다.
function ArchivesYearFilter({ value, onChange }: ArchivesYearFilterProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOlderYearSelected = OLDER_YEARS.includes(value);

  // WDS Menu는 항목을 골라도 스스로 닫히지 않아서, 선택과 동시에 직접 닫는다.
  const handleOlderYearChange = (year?: string | string[]) => {
    if (typeof year === "string") {
      onChange(year);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto">
      <FilterChipGroup
        onChange={onChange}
        options={RECENT_YEARS}
        value={value}
      />

      <Menu
        onOpenChange={setIsMenuOpen}
        onValueChange={handleOlderYearChange}
        open={isMenuOpen}
        value={value}
      >
        <MenuTrigger>
          {/* 이전 연도를 고르면 "~2023" 대신 고른 연도를 보여준다 */}
          <button
            className={getFilterChipClassName(isOlderYearSelected)}
            type="button"
          >
            <Typography
              color={
                isOlderYearSelected
                  ? "semantic.primary.normal"
                  : "semantic.label.alternative"
              }
              variant="caption1"
              weight={isOlderYearSelected ? "bold" : "medium"}
            >
              {isOlderYearSelected ? value : OLDER_YEARS_LABEL}
            </Typography>
            <IconChevronDown className="size-3.5" />
          </button>
        </MenuTrigger>
        {/* Menu 기본 너비(320px)가 Figma(150px)보다 넓어서 너비만 맞춘다 */}
        <MenuContent offset={8} position="bottom-start" sx={{ width: 150 }}>
          <MenuList>
            {OLDER_YEARS.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </MenuList>
        </MenuContent>
      </Menu>
    </div>
  );
}

export default ArchivesYearFilter;
