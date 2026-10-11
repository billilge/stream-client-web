import { Typography } from "@wanteddev/wds";
import { IconCircleCloseFill, IconSearch } from "@wanteddev/wds-icon";
import type { Ref } from "react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Enter·키보드 검색 키 제출 */
  onSubmit: () => void;
  inputRef?: Ref<HTMLInputElement>;
}

// Figma: Search Field (nodeId 3147:138703) — Stream 로컬 컴포넌트다(wds-component-usage.md
// "제외됨" 표의 `SearchField`). WDS `SearchField`가 코드에 있지만 스펙이 달라서 쓰지 않았다
// (search-field/style.js 확인):
//   - 배경이 `fill.normal`(rgba 8%)인데 Figma는 `Background/Normal/Alternative`(#F7F7F8)
//   - padding이 medium 12px / small 8px 사방 동일인데 Figma는 가로 12 · 세로 8 (높이 40)
//   - 지움 버튼이 입력창에 포커스가 있을 때만 보이는데 Figma 검색 완료 화면은 포커스 없이도 보인다
// 내부를 오버라이드해야 맞출 수 있어서(컨벤션상 금지) 로컬로 짰다.
//
// 입력칸 글자는 Figma `Body 1/Normal - Regular`라 Typography를 `as="input"`으로 렌더해 WDS에서 받는다.
function SearchField({
  value,
  onChange,
  onSubmit,
  inputRef,
}: SearchFieldProps) {
  const hasValue = value.length > 0;

  return (
    <form
      aria-label="검색"
      className="flex h-10 w-full items-center gap-2 rounded-xl bg-background-alternative px-3 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Typography
        aria-label="검색어"
        as="input"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-label-assistive"
        color="semantic.label.normal"
        enterKeyHint="search"
        onChange={(event) => onChange(event.target.value)}
        placeholder="검색어를 입력하세요"
        ref={inputRef}
        type="text"
        value={value}
        variant="body1"
        weight="regular"
      />
      {hasValue ? (
        <button
          aria-label="검색어 지우기"
          className="flex shrink-0 text-label-assistive"
          onClick={() => onChange("")}
          type="button"
        >
          <IconCircleCloseFill className="size-4" />
        </button>
      ) : (
        <IconSearch className="size-5 shrink-0 text-label-assistive" />
      )}
    </form>
  );
}

export default SearchField;
