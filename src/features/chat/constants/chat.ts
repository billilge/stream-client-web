// Figma: Toast/Toast (nodeId 2036:101997) — 메시지 전송이 실패했을 때 띄운다.
export const CHAT_SEND_FAILURE_MESSAGE =
  "전송에 실패했어요. 다시 시도해 주세요.";

// 실패 경로를 손으로 확인하려고 둔 목업 트리거. AI 응답은 아직 백엔드가 없어서
// `ChatEntryScreen`의 전송이 항상 성공하는데, 그러면 실패 토스트를 띄워볼 방법이 없다.
// 이 문구를 그대로 보내면 전송에 실패한 것처럼 동작한다.
//
// **API를 붙일 때 이 상수와 호출부의 분기를 지운다** — 실제 요청 실패로 판정이 바뀐다.
export const CHAT_SEND_FAILURE_TRIGGER = "전송 실패";
