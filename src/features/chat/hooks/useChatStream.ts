import { useEffect, useRef, useState } from "react";

import { streamChatMessage } from "@/shared/entities/chat/chatStream";

interface ChatUserMessage {
  id: number;
  sender: "user";
  text: string;
}

// 답변은 문단마다 말풍선을 나눠 보여준다 — 서버가 문단 경계마다 보내는 bubble 이벤트로 나눈다
interface ChatBotMessage {
  id: number;
  sender: "bot";
  bubbles: string[];
}

export type ChatMessage = ChatUserMessage | ChatBotMessage;

interface UseChatStreamOptions {
  // 답변을 받지 못했을 때 — 보낸 질문을 돌려주니 화면은 입력창에 되살리고 토스트를 띄운다
  onFailure: (question: string) => void;
}

// 챗봇 대화 한 번(채팅방 입장 한 번)의 상태. 질문을 보내고 답변 조각을 말풍선에 이어 붙인다.
export function useChatStream({ onFailure }: UseChatStreamOptions) {
  // 화면이 처음 그려질 때 한 번 만든다. 나갔다 다시 들어오면 새로 그려져 새 대화가 된다 —
  // 화면이 "들어올 때마다 새 대화"인 것과 서버가 이력을 붙이는 범위를 맞춘다
  const [conversationId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 질문을 보낸 뒤 done·error가 올 때까지. 서버도 한 사람당 답변 하나만 받아서 그동안 입력을 막는다
  const [isAnswering, setIsAnswering] = useState(false);
  const nextMessageIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 답변 중에 화면을 떠나면(종료하기·뒤로가기) 연결을 끊는다 — 서버도 학생이 끊으면 중계를 멈춘다
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function nextMessageId() {
    nextMessageIdRef.current += 1;
    return nextMessageIdRef.current;
  }

  async function send(question: string) {
    if (isAnswering) {
      return;
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const userMessageId = nextMessageId();
    let botMessageId: number | null = null;
    // bubble을 받으면 바로 빈 말풍선을 만들지 않고, 다음 조각이 올 때 연다 — 빈 말풍선이 잠깐 보이지 않게
    let isNewBubblePending = false;

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, sender: "user", text: question },
    ]);
    setIsAnswering(true);

    try {
      await streamChatMessage(
        { conversationId, message: question },
        {
          onBubble: () => {
            isNewBubblePending = true;
          },
          onDelta: (text) => {
            if (botMessageId === null) {
              const id = nextMessageId();
              botMessageId = id;
              setMessages((prev) => [
                ...prev,
                { bubbles: [text], id, sender: "bot" },
              ]);
              return;
            }
            const id = botMessageId;
            const opensBubble = isNewBubblePending;
            isNewBubblePending = false;
            setMessages((prev) =>
              prev.map((message) =>
                message.id === id && message.sender === "bot"
                  ? {
                      ...message,
                      bubbles: opensBubble
                        ? [...message.bubbles, text]
                        : appendToLastBubble(message.bubbles, text),
                    }
                  : message,
              ),
            );
          },
        },
        controller.signal,
      );
    } catch (error) {
      // 화면을 떠나 끊은 요청 — 그릴 화면이 없다
      if (controller.signal.aborted) {
        return;
      }
      console.error("챗봇 답변을 받지 못했어요.", error);
      // 받다 만 답변까지 걷어 내고 질문을 입력창으로 돌려보낸다 — 같은 질문을 바로 다시 보낼 수 있게
      setMessages((prev) =>
        prev.filter(
          (message) =>
            message.id !== userMessageId && message.id !== botMessageId,
        ),
      );
      onFailure(question);
    }
    setIsAnswering(false);
  }

  const lastMessage = messages.at(-1);
  // 보낸 뒤 첫 조각이 오기 전까지만 응답 대기 점을 보여준다 — 조각이 오면 말풍선이 그 자리를 잇는다
  const isWaitingForAnswer = isAnswering && lastMessage?.sender === "user";

  return { isAnswering, isWaitingForAnswer, messages, send };
}

function appendToLastBubble(bubbles: string[], text: string): string[] {
  const last = bubbles.at(-1) ?? "";
  return [...bubbles.slice(0, -1), last + text];
}
