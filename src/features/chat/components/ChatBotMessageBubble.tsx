import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import botIcon from "@/assets/icons/chat/bot.svg";

interface ChatBotMessageBubbleProps {
  // 문단별 답변. 받는 중이면 마지막 말풍선이 계속 자란다
  bubbles: string[];
}

// Figma: 챗봇 대화창의 Bot Response(nodeId 1770:63307) — 아바타(44px, Atomic/Blue/65
// #4F95FF·홈 FAB의 primary #0066FF와는 다른 대화 중 전용 색) + 말풍선(왼쪽 정렬, 좌상단만
// 4px로 꺾임). 답변은 문단마다 말풍선을 나누고 아바타는 첫 말풍선 위에 한 번만 둔다(AI 서버 계약).
// 말풍선 폭은 사용자 말풍선처럼 최대 272px로만 막는다 — 짧은 문단이 넓은 빈 상자로 보이지 않게.
function ChatBotMessageBubble({ bubbles }: ChatBotMessageBubbleProps) {
  return (
    <div className="flex flex-col items-start gap-3 px-5">
      <div className="flex size-11 items-center justify-center rounded-[22px] bg-chatbot-avatar">
        <img alt="" className="h-[19.6px] w-[23.4px]" src={botIcon} />
      </div>
      <div className="flex flex-col items-start gap-2">
        {bubbles.map((bubble, index) => (
          <div
            className="max-w-[272px] rounded-tl-[4px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-background-alternative px-4 py-2.5"
            // biome-ignore lint/suspicious/noArrayIndexKey: 말풍선은 뒤에 붙기만 하고 순서가 바뀌거나 빠지지 않는다
            key={index}
          >
            {/* 목록처럼 한 줄 줄바꿈은 그대로 온다 */}
            <Typography
              className="whitespace-pre-line"
              color="semantic.label.normal"
              variant="body2-reading"
            >
              {renderBold(bubble)}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

// `**굵게**`만 굵은 글씨로 바꾼다 — AI 서버 프롬프트가 제목·표·코드 블록을 쓰지 않아 다른 마크다운은 오지 않는다.
// 지금까지 받은 글 전체로 나눠야 조각 경계에서 쪼개진 `**`도 짝이 맞는다. 받는 중이라 아직 닫히지 않은
// `**`는 숨기고 그 뒤를 미리 굵게 그린다 — 닫히는 조각이 오면 그대로 굵게 남는다.
function renderBold(text: string): ReactNode[] {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: 같은 글을 나눈 조각이라 순서가 바뀌지 않는다 — 받는 중에도 뒤에 붙기만 한다
      <strong className="font-bold" key={index}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default ChatBotMessageBubble;
