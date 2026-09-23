import { TopNavigationButton, Typography } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import ChatBotMessageBubble from "@/features/chat/components/ChatBotMessageBubble";
import ChatGradientBackground from "@/features/chat/components/ChatGradientBackground";
import ChatInput from "@/features/chat/components/ChatInput";
import ChatLoadingDots from "@/features/chat/components/ChatLoadingDots";
import ChatMessageBubble from "@/features/chat/components/ChatMessageBubble";
import SuggestedQuestion from "@/features/chat/components/SuggestedQuestion";
import { CHAT_SUGGESTED_QUESTIONS } from "@/features/chat/constants/chatSuggestedQuestions";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
}

// 실제 AI 응답(백엔드 연동)은 이번 범위 밖이라, 메시지를 보내면 Figma의 "로딩모션" 상태
// (응답 대기 점 3개)를 잠깐 보여준 뒤 ChatBotMessageBubble의 목업 답변으로 넘어간다 —
// 사용자가 실제로 입력한 내용과 무관하게 항상 같은 응답이다.
const BOT_RESPONSE_DELAY_MS = 1200;

// Figma: 챗봇 진입 화면(nodeId 1887:91534)과 챗봇 대화창(1770:63314) — 메시지를 하나라도
// 보내면 진입 화면의 웰컴 문구·그라데이션·추천 질문이 페이드아웃되고 대화창(말풍선 + 응답
// 대기 점)이 페이드인된다. 두 레이어를 같은 자리에 absolute로 겹쳐서 opacity만 트랜지션하므로
// 레이아웃이 튀지 않는다.
function ChatEntryScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotLoading, setIsBotLoading] = useState(false);
  const nextMessageIdRef = useRef(0);
  const botTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatStarted = messages.length > 0;

  useEffect(() => {
    return () => {
      if (botTimerRef.current) {
        clearTimeout(botTimerRef.current);
      }
    };
  }, []);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
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
    if (!trimmed) {
      return;
    }
    nextMessageIdRef.current += 1;
    setMessages((prev) => [
      ...prev,
      { id: nextMessageIdRef.current, sender: "user", text: trimmed },
    ]);
    setInputValue("");

    setIsBotLoading(true);
    if (botTimerRef.current) {
      clearTimeout(botTimerRef.current);
    }
    botTimerRef.current = setTimeout(() => {
      nextMessageIdRef.current += 1;
      setMessages((prev) => [
        ...prev,
        { id: nextMessageIdRef.current, sender: "bot", text: "" },
      ]);
      setIsBotLoading(false);
    }, BOT_RESPONSE_DELAY_MS);
  }

  return (
    <div className="relative flex h-full flex-col">
      <ChatGradientBackground showBlob={!chatStarted} />
      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col gap-8 overflow-y-auto px-5 pt-8 transition-opacity duration-300 ${
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
          className={`absolute inset-0 flex flex-col gap-3 overflow-y-auto pt-4 pb-2 transition-opacity duration-300 ${
            chatStarted ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {messages.map((message) =>
            message.sender === "user" ? (
              <ChatMessageBubble key={message.id} message={message.text} />
            ) : (
              <ChatBotMessageBubble key={message.id} />
            ),
          )}
          {isBotLoading && <ChatLoadingDots />}
        </div>
      </div>
      <div className="relative px-5 pb-5">
        <ChatInput
          onChange={setInputValue}
          onSubmit={() => sendMessage(inputValue)}
          value={inputValue}
        />
      </div>
    </div>
  );
}

export default ChatEntryScreen;
