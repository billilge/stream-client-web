// POST /v1/app/chat/messages 요청 본문. 지난 대화는 서버가 conversationId로 찾아 붙이므로 이번 질문만 보낸다.
export interface ChatMessageRequest {
  // 채팅방에 들어올 때 만든 UUID — 같은 방의 질문은 같은 값을 보내야 서버가 앞 대화를 이어 준다
  conversationId: string;
  // 1~500자. 넘으면 서버가 400을 준다
  message: string;
}

// 답변 조각이 올 때마다 부르는 콜백. 정상 종료(done)·실패(error)는 streamChatMessage의 Promise로 받는다.
export interface ChatStreamHandlers {
  // 지금 말풍선에 이어 붙일 답변 조각. 빈 줄은 들어 있지 않다
  onDelta: (text: string) => void;
  // 여기서부터 새 말풍선 — 첫 말풍선 앞과 마지막 말풍선 뒤에는 오지 않는다
  onBubble: () => void;
}
