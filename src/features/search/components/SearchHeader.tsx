import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import type { Ref } from "react";

import SearchField from "@/features/search/components/SearchField";

interface SearchHeaderProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  inputRef?: Ref<HTMLInputElement>;
}

// Figma: 검색 > Navigation (nodeId 3147:138650) — 뒤로가기 24px + 검색 필드, 높이 60(세로 10 패딩).
// ScreenHeader(타이틀 + 트레일링 아이콘 슬롯)에 넣지 않고 화면 본문 최상단에 직접 둔다. 입력값이
// 화면 state라서, 헤더 슬롯(useScreenHeader)에 넣으면 타이핑할 때마다 헤더를 다시 등록하느라
// 제어 입력의 값이 한 박자 늦게 반영돼 한글 조합(IME)이 끊긴다.
function SearchHeader({
  value,
  onChange,
  onSubmit,
  onBack,
  inputRef,
}: SearchHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-4 py-2.5 pr-5 pl-4">
      <TopNavigationButton
        aria-label="뒤로가기"
        onClick={onBack}
        variant="icon"
      >
        <IconChevronLeft />
      </TopNavigationButton>
      <div className="min-w-0 flex-1">
        <SearchField
          inputRef={inputRef}
          onChange={onChange}
          onSubmit={onSubmit}
          value={value}
        />
      </div>
    </div>
  );
}

export default SearchHeader;
