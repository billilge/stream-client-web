import { IconArrowUp } from "@wanteddev/wds-icon";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

// Figma: 챗봇 입력창 — state=Default(nodeId 1628:175742, 빈 입력: placeholder 회색 텍스트 +
// 비활성 회색(#e1e2e4) 전송 버튼)와 state=Active(nodeId 1770:61488, 입력 있음: 검정 텍스트 +
// 파란(primary) 전송 버튼)를 입력값 유무로 토글한다. WDS `TextField`는 box-shadow +
// backdrop-blur(32px)가 기본이라 Figma의 flat 배경(그림자 없음)과 달라 재사용하지 않는다.
// 텍스트 스타일(15px/0.0096em)은 WDS Typography의 body2 값을 그대로 따랐다 — Typography
// 컴포넌트 자체는 자기 태그를 렌더링해서 네이티브 input에는 못 씌운다.
function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  const isActive = value.trim().length > 0;

  return (
    <form
      className="flex w-full items-center justify-between rounded-2xl bg-background-alternative p-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-label-normal leading-[1.375rem] tracking-[0.0096em] placeholder:text-label-assistive focus:outline-none"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Stream AI에게 무엇이든 물어보세요"
        value={value}
      />
      <button
        aria-label="전송"
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
          isActive ? "bg-primary" : "bg-[#e1e2e4]"
        }`}
        disabled={!isActive}
        type="submit"
      >
        <IconArrowUp className="size-4 text-static-white" />
      </button>
    </form>
  );
}

export default ChatInput;
