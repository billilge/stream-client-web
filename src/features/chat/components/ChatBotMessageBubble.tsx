import { Typography } from "@wanteddev/wds";
import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

import botIcon from "@/assets/icons/chat/bot.svg";

interface ChatBotMessageBubbleProps {
  // 문단별 답변. 받는 중이면 마지막 말풍선이 계속 자란다
  bubbles: string[];
  // 답변 속 링크를 눌러 다른 화면으로 떠나기 직전 — 돌아왔을 때 대화를 되살리도록 화면이 대화를 맡겨 둔다
  onLinkClick?: () => void;
}

// AI 서버는 공지·행사를 근거로 답하면 마지막 줄에 `출처: [제목](/notices/11) (게시일)`을 보낸다(stream-ai #82).
// 주소는 공지·행사 상세 경로(`/notices/숫자`, `/events/숫자`)만 링크로 만든다 — 답변은 모델이 쓴 글이라
// `//다른사이트`·`/\다른사이트`·`https:`·`javascript:`가 섞여 와도 누르는 링크가 되면 안 된다.
// `/`로 시작하는지만 보면 `/\evil.example`이 통과하고, 브라우저는 역슬래시를 슬래시로 읽어 외부 사이트로 이동한다.
// 출처 링크는 공지·행사만 오므로 그 두 경로만 허용하고, 나머지는 글자 그대로 둔다.
const MARKDOWN_LINK_PATTERN = /\[([^\]\n]+)\]\((\/(?:notices|events)\/\d+)\)/g;

// Figma: 챗봇 대화창의 Bot Response(nodeId 1770:63307) — 아바타(44px, Atomic/Blue/65
// #4F95FF·홈 FAB의 primary #0066FF와는 다른 대화 중 전용 색) + 말풍선(왼쪽 정렬, 좌상단만
// 4px로 꺾임). 답변은 문단마다 말풍선을 나누고 아바타는 첫 말풍선 위에 한 번만 둔다(AI 서버 계약).
// 말풍선 폭은 사용자 말풍선처럼 최대 272px로만 막는다 — 짧은 문단이 넓은 빈 상자로 보이지 않게.
function ChatBotMessageBubble({
  bubbles,
  onLinkClick,
}: ChatBotMessageBubbleProps) {
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
              {renderLinks(bubble, onLinkClick)}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

// 링크 자리를 먼저 나누고, 링크 바깥 글과 링크 글자 각각에 굵게를 입힌다.
// 받는 중이라 아직 `)`가 오지 않은 링크는 패턴에 안 걸려 잠깐 글자 그대로 보이고, 닫히는 조각이 오면 링크로 바뀐다.
function renderLinks(text: string, onLinkClick?: () => void): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(MARKDOWN_LINK_PATTERN)) {
    const [whole, label, path] = match;
    nodes.push(
      <Fragment key={`text-${lastIndex}`}>
        {renderBold(text.slice(lastIndex, match.index))}
      </Fragment>,
      // 공지 목록→상세처럼 화면을 쌓는 이동이라 슬라이드 전환을 켠다(coding-style 「라우팅」)
      <Link
        className="underline"
        key={`link-${match.index}`}
        onClick={onLinkClick}
        to={path}
        viewTransition
      >
        {renderBold(label)}
      </Link>,
    );
    lastIndex = match.index + whole.length;
  }
  nodes.push(
    <Fragment key={`text-${lastIndex}`}>
      {renderBold(text.slice(lastIndex))}
    </Fragment>,
  );
  return nodes;
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
