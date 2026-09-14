import {
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  MenuTrigger,
} from "@wanteddev/wds";
import { IconChevronDown } from "@wanteddev/wds-icon";
import { useState } from "react";

const RECENT_YEARS = ["2026", "2025", "2024"];
const OLDER_YEARS = ["2023", "2022", "2021", "2020"];
const OLDER_YEARS_LABEL = "~2023";

interface ArchivesYearFilterProps {
  value: string;
  onChange: (year: string) => void;
}

function getChipClassName(isActive: boolean) {
  return isActive
    ? "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[20px] border border-primary bg-primary-subtle px-3 py-2 font-semibold text-primary text-xs"
    : "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-[20px] border border-line-normal-neutral px-3 py-2 font-medium text-label-alternative text-xs";
}

// Figma: 아카이빙 상세 Filter Row (nodeId 1276:95404) — WDS Chip이 아니라 빌릴게 필터와 같은 Stream 로컬 커스텀 칩.
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
    <div className="flex gap-2 overflow-x-auto">
      {RECENT_YEARS.map((year) => (
        <button
          className={getChipClassName(year === value)}
          key={year}
          onClick={() => onChange(year)}
          type="button"
        >
          {year}
        </button>
      ))}

      <Menu
        onOpenChange={setIsMenuOpen}
        onValueChange={handleOlderYearChange}
        open={isMenuOpen}
        value={value}
      >
        <MenuTrigger>
          {/* 이전 연도를 고르면 "~2023" 대신 고른 연도를 보여준다 */}
          <button
            className={getChipClassName(isOlderYearSelected)}
            type="button"
          >
            {isOlderYearSelected ? value : OLDER_YEARS_LABEL}
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
