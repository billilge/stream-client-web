import { Typography } from "@wanteddev/wds";

import botIcon from "@/assets/icons/chat/bot.svg";

// Figma: 챗봇 대화창의 Bot Response(nodeId 1770:63307) — 아바타(44px, Atomic/Blue/65
// #4F95FF·홈 FAB의 primary #0066FF와는 다른 대화 중 전용 색) + 말풍선(왼쪽 정렬, 좌상단만
// 4px로 꺾임). 실제 AI 응답(백엔드 연동)은 이번 범위 밖이라, Figma가 이 화면의 mock
// 콘텐츠로 이미 써둔 답변 텍스트를 그대로 목업으로 보여준다 — 사용자가 실제로 입력한
// 질문과 무관하게 항상 같은 응답이다.
function ChatBotMessageBubble() {
  return (
    <div className="flex flex-col items-start gap-3 px-5">
      <div className="flex size-11 items-center justify-center rounded-[22px] bg-chatbot-avatar">
        <img alt="" className="h-[19.6px] w-[23.4px]" src={botIcon} />
      </div>
      <div className="w-[272px] max-w-[272px] rounded-tl-[4px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-background-alternative px-4 py-2.5">
        <Typography color="semantic.label.normal" variant="body2-reading">
          학생회비는{" "}
          <strong className="font-bold">
            마이 &gt; 학생 서비스 &gt; 회비 납부 내역
          </strong>
          에서 확인하실 수 있어요!
          <br />
          <br />
          혹시 메뉴를 찾기 어려우시면 제가 안내해 드릴게요!
        </Typography>
      </div>
    </div>
  );
}

export default ChatBotMessageBubble;
