// Figma: Toast/Toast (nodeId 2036:101997) — 메시지 전송이 실패했을 때 띄운다.
// 답변을 받지 못한 모든 경우(연결 실패·서버 거절·답변 도중 실패)에 같은 문구를 쓴다 — 서버가 error 이벤트에 담는
// 안내문은 "~합니다"체라 앱 말투와 달라서 보여주지 않는다.
export const CHAT_SEND_FAILURE_MESSAGE =
  "전송에 실패했어요. 다시 시도해 주세요.";

// 질문 길이 상한. 서버가 이보다 긴 질문을 400으로 거절해서(토큰 비용·프롬프트 인젝션 방지) 입력에서 먼저 막는다.
export const CHAT_MESSAGE_MAX_LENGTH = 500;
