import { Typography } from "@wanteddev/wds";
import { useEffect, useMemo, useRef, useState } from "react";

interface AuthCodeInputProps {
  value: string;
  /** 인증번호 자릿수 — 칸 수와 입력 길이가 같다 */
  length: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  /** 마지막 자리까지 채우면 한 번 부른다 */
  onComplete: (value: string) => void;
}

// Figma: 인증번호 칸 (nodeId 4519:50281) — state=off(빈 칸) / state=on(숫자). WDS에 인증번호 입력 컴포넌트가 없어서
// Stream 로컬로 만든다(WDS `virtual-input`은 폼용 숨은 입력 도우미라 다른 용도다).
// 칸 6개는 보이기만 하고, 실제 입력은 위에 투명하게 덮은 `<input>` 하나가 받는다 — 숫자 키패드, 붙여넣기,
// 문자 메시지 인증번호 자동 완성(`one-time-code`)이 칸마다 입력칸을 두는 것보다 안정적으로 동작한다.
// 입력칸이 보이지 않아 기본 커서도 안 보이므로, 포커스가 있을 때 다음에 채울 칸에 깜빡이는 커서를 직접 그린다
// (Figma에는 없는 표시 — 키패드가 아직 안 올라온 상태와 구분되고, 칸을 눌러 입력을 시작하라는 단서가 된다).
// 칸을 어디 눌러도 입력 위치는 항상 맨 뒤다 — 눌린 자리에 커서가 놓이면 새 숫자가 중간에 끼어서
// 화면의 커서(다음 칸)와 실제 입력 위치가 어긋난다. 이미 맨 뒤면 건드리지 않아서 선택 이벤트가 되풀이되지 않는다.
function moveCaretToEnd(input: HTMLInputElement) {
  const end = input.value.length;
  if (input.selectionStart !== end || input.selectionEnd !== end) {
    input.setSelectionRange(end, end);
  }
}

function AuthCodeInput({
  value,
  length,
  disabled = false,
  onChange,
  onComplete,
}: AuthCodeInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  // map 콜백의 index를 key로 쓰면 noArrayIndexKey에 걸려서 미리 만들어 둔다(PhotoGallery와 같다)
  const cells = useMemo(
    () =>
      Array.from({ length }, (_, index) => ({
        index,
        key: `code-cell-${index}`,
      })),
    [length],
  );

  // 화면에 들어오면 바로 키패드가 올라오게 하고, 잠겼다 풀리면(확인 실패 뒤) 다시 입력할 수 있게 포커스를 되돌린다
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // 커서는 입력할 수 있는 상태(포커스, 잠기지 않음)에서 다음에 채울 칸에만 놓는다. 6자리가 다 차면 없다
  const caretIndex = isFocused && !disabled ? value.length : -1;

  return (
    <div className="relative flex gap-2.25">
      {cells.map(({ index, key }) => (
        <div
          aria-hidden
          className="flex h-15 w-12 items-center justify-center rounded-lg bg-background-alternative"
          key={key}
        >
          {index === caretIndex ? (
            <span className="auth-code-caret h-7 w-0.5 rounded-full bg-primary" />
          ) : (
            <Typography
              as="span"
              color="semantic.primary.normal"
              variant="title2"
              weight="bold"
            >
              {value[index] ?? ""}
            </Typography>
          )}
        </div>
      ))}
      <input
        aria-label={`인증번호 ${length}자리`}
        autoComplete="one-time-code"
        className="absolute inset-0 size-full opacity-0"
        disabled={disabled}
        inputMode="numeric"
        maxLength={length}
        onBlur={() => setIsFocused(false)}
        onChange={(event) => {
          const nextValue = event.target.value
            .replace(/\D/g, "")
            .slice(0, length);
          onChange(nextValue);
          if (nextValue.length === length) {
            onComplete(nextValue);
          }
        }}
        onClick={(event) => moveCaretToEnd(event.currentTarget)}
        onFocus={() => setIsFocused(true)}
        onSelect={(event) => moveCaretToEnd(event.currentTarget)}
        pattern="[0-9]*"
        ref={inputRef}
        type="text"
        value={value}
      />
    </div>
  );
}

export default AuthCodeInput;
