const DOT_DELAYS_MS = [0, 200, 400];

// Figma: 챗봇 대화창의 응답 대기 점 3개(nodeId 1770:63320) — CSS 키프레임은 index.css의
// chat-loading-dot 참고(원본 애니메이션 트랙을 점 크기에 맞게 축소한 이유 포함).
function ChatLoadingDots() {
  return (
    <div
      aria-label="응답을 기다리는 중"
      className="flex items-center gap-[7px] px-5"
      role="status"
    >
      {DOT_DELAYS_MS.map((delay) => (
        <span
          className="chat-loading-dot size-[7.2px] rounded-full bg-[#323232]"
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

export default ChatLoadingDots;
