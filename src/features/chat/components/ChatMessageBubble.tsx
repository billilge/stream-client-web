import { Typography } from "@wanteddev/wds";

interface ChatMessageBubbleProps {
  message: string;
}

// Figma: 챗봇 대화창의 User Message 말풍선(nodeId 1628:176004) — 우측 정렬, 우상단만 4px로
// 꺾여서 "내가 보낸" 말풍선임을 표시한다. 텍스트 색은 Figma가 실제로 Background/Normal/Normal
// (흰색) 변수를 그대로 재사용해서 바인딩해뒀다 — static.white 대신 그 변수를 그대로 따른다.
function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <div className="flex w-full justify-end px-5">
      <div className="max-w-[272px] rounded-tl-2xl rounded-tr-[4px] rounded-br-2xl rounded-bl-2xl bg-label-neutral px-4 py-2.5">
        <Typography
          color="semantic.background.normal.normal"
          variant="body2-reading"
        >
          {message}
        </Typography>
      </div>
    </div>
  );
}

export default ChatMessageBubble;
