import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ChatBotMessageBubble from "@/features/chat/components/ChatBotMessageBubble";
import ChatGradientBackground from "@/features/chat/components/ChatGradientBackground";
import ChatInput from "@/features/chat/components/ChatInput";
import ChatLoadingDots from "@/features/chat/components/ChatLoadingDots";
import ChatMessageBubble from "@/features/chat/components/ChatMessageBubble";
import SuggestedQuestion from "@/features/chat/components/SuggestedQuestion";
import { CHAT_SEND_FAILURE_MESSAGE } from "@/features/chat/constants/chat";
import { CHAT_SUGGESTED_QUESTIONS } from "@/features/chat/constants/chatSuggestedQuestions";
import { useChatStream } from "@/features/chat/hooks/useChatStream";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// Figma: 챗봇 진입 화면(nodeId 1887:91534)과 챗봇 대화창(1770:63314) — 메시지를 하나라도
// 보내면 진입 화면의 웰컴 문구·그라데이션·추천 질문이 페이드아웃되고 대화창(말풍선 + 응답
// 대기 점)이 페이드인된다. 두 레이어를 같은 자리에 absolute로 겹쳐서 opacity만 트랜지션하므로
// 레이아웃이 튀지 않는다.
function ChatEntryScreen() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isFailureToastOpen, setIsFailureToastOpen] = useState(false);
  // 연달아 실패해도 스크린리더가 토스트를 다시 안내하도록 실패마다 새로 마운트한다 — 아래 key다
  // (행사 신청 화면의 실패 토스트와 같은 패턴)
  const [failureCount, setFailureCount] = useState(0);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 답변을 받지 못하면 보낸 말풍선을 걷고 질문을 입력창에 되살려 둔다 — 그대로 다시 보낼 수 있게
  const { isAnswering, isWaitingForAnswer, messages, send } = useChatStream({
    onFailure: (question) => {
      setInputValue(question);
      setFailureCount((prev) => prev + 1);
      setIsFailureToastOpen(true);
    },
  });
  const chatStarted = messages.length > 0;

  // 메시지가 추가되거나 답변 조각이 붙을 때, 응답 대기 점이 나타날 때마다 최신 대화가 보이도록 맨 아래로 스크롤한다.
  // biome-ignore lint/correctness/useExhaustiveDependencies: 값을 직접 참조하진 않지만 변경 시점을 감지해 스크롤을 트리거하기 위해 의도적으로 의존성에 둔다
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages, isWaitingForAnswer]);

  // 답변을 받는 동안에는 입력창이 disabled되며 포커스가 풀린다 — 답변이 끝나면(성공·실패 모두)
  // 바로 이어서 타이핑할 수 있도록 입력창에 포커스를 되돌린다.
  //
  // 단 나가기 모달이 떠 있으면 건너뛴다. 메시지를 보내자마자 뒤로가기를 누르면 답변을 받는
  // 동안 모달이 열리는데, 그때 이 포커스 이동이 일어나면 초점이 모달 밖 입력창으로 빠져서
  // 타이핑이 뒤 화면으로 들어가고 Esc로도 모달이 닫히지 않는다(모달의 Esc 핸들러가 모달
  // 엘리먼트에 붙어 있다). 모달을 닫을 때 ConfirmModal이 직전 초점으로 되돌려 준다.
  const wasAnsweringRef = useRef(false);
  useEffect(() => {
    if (wasAnsweringRef.current && !isAnswering && !isLeaveOpen) {
      inputRef.current?.focus();
    }
    wasAnsweringRef.current = isAnswering;
  }, [isAnswering, isLeaveOpen]);

  // Figma: 챗봇 뒤로가기 확인 모달(2036:102030). 나가면 대화가 사라지니 확인을 받는데,
  // 아직 아무 말도 안 한 상태에서는 잃을 게 없어서 바로 나간다
  // (행사 신청 화면이 작성한 답이 있을 때만 모달을 띄우는 것과 같은 기준).
  // "종료하기"는 대화를 끝내는 행동이라 들어온 화면이 아니라 홈으로 보낸다. 답변을 받는 중이었으면
  // 화면이 사라지면서 useChatStream이 연결을 끊는다.
  const leaveChat = () => navigate("/");
  // 대화 전 뒤로가기 — 타고 들어왔으면 한 단계 뒤로, /chat으로 바로 들어왔으면(딥링크·새로고침·
  // 주소 직접 입력) 홈으로 보낸다. navigate(-1)만 쓰면 돌아갈 곳이 없어 먹통이 된다.
  const goBack = useBackNavigation("/");

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => (chatStarted ? setIsLeaveOpen(true) : goBack())}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="Stream AI"
      variant="normal"
    />,
  );

  function sendMessage(text: string) {
    const trimmed = text.trim();
    // 서버가 한 사람당 답변 하나만 받아서, 답변이 끝날 때까지는 전송 자체를 막는다
    if (!trimmed || isAnswering) {
      return;
    }
    setInputValue("");
    void send(trimmed);
  }

  return (
    <div className="relative flex h-full flex-col">
      <ChatGradientBackground showBlob={!chatStarted} />
      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col gap-40 overflow-y-auto px-5 pt-8 transition-opacity duration-300 ${
            chatStarted ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex w-[170px] flex-col gap-2">
            <Typography color="semantic.label.alternative" variant="label1">
              어떤 점이 궁금하세요?
            </Typography>
            <div className="flex flex-col gap-1">
              <Typography
                color="semantic.label.strong"
                variant="heading1"
                weight="bold"
              >
                <span className="bg-gradient-to-r from-primary to-[#6f66ff] bg-clip-text text-transparent">
                  Stream AI
                </span>
                가
              </Typography>
              <Typography
                color="semantic.label.strong"
                variant="heading1"
                weight="bold"
              >
                바로 답해 드릴게요
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            {CHAT_SUGGESTED_QUESTIONS.map((question) => (
              <SuggestedQuestion
                key={question.id}
                onClick={() => sendMessage(question.text)}
                question={question.text}
              />
            ))}
          </div>
        </div>
        <div
          className={`absolute inset-0 flex flex-col gap-3 overflow-y-auto pt-4 pb-4 transition-opacity duration-300 ${
            chatStarted ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          ref={messageListRef}
        >
          {messages.map((message) =>
            message.sender === "user" ? (
              <ChatMessageBubble key={message.id} message={message.text} />
            ) : (
              <ChatBotMessageBubble
                bubbles={message.bubbles}
                key={message.id}
              />
            ),
          )}
          {isWaitingForAnswer && <ChatLoadingDots />}
        </div>
      </div>
      <div className="relative px-5 pb-5">
        <ChatInput
          disabled={isAnswering}
          onChange={setInputValue}
          onSubmit={() => sendMessage(inputValue)}
          ref={inputRef}
          value={inputValue}
        />
      </div>

      <ConfirmModal
        cancelLabel="계속 대화하기"
        confirmLabel="종료하기"
        description="현재 대화는 저장되지 않아요."
        onCancel={() => setIsLeaveOpen(false)}
        onConfirm={leaveChat}
        open={isLeaveOpen}
        title="대화를 종료할까요?"
      />

      <ScreenToast
        key={failureCount}
        message={CHAT_SEND_FAILURE_MESSAGE}
        onOpenChange={setIsFailureToastOpen}
        open={isFailureToastOpen}
      />
    </div>
  );
}

export default ChatEntryScreen;
