import { z } from "zod";

import {
  ApiError,
  type ApiResponse,
  clearAccessToken,
  getAccessToken,
  isApiResponse,
  NetworkError,
  TimeoutError,
} from "@/shared/api";
import type {
  ChatMessageRequest,
  ChatStreamHandlers,
} from "@/shared/entities/chat/chatTypes";

const CHAT_MESSAGES_PATH = "/v1/app/chat/messages";

// 조각 사이 무응답 한도. 서버는 AI 서버 조각을 30초 기다린 뒤 스스로 error를 보내므로 그보다 길게 잡는다 —
// 서버의 error가 먼저 오고, 이 타이머는 학생 쪽 네트워크가 조용히 끊긴 경우만 잡는다
const IDLE_TIMEOUT_MS = 40_000;

// done·error 없이 스트림이 끝났을 때 쓰는 안내. 서버도 같은 경우에 이 문구로 error를 보낸다
const STREAM_CLOSED_MESSAGE = "답변 생성 중 오류가 발생했습니다.";

const chatDeltaDataSchema = z.looseObject({ text: z.string() });
const chatErrorDataSchema = z.looseObject({ message: z.string() });

// 스트림이 시작된 뒤의 실패(AI 서버 오류·이미 답변 중·done 없이 끊김). 상태 코드가 이미 200으로 나간 뒤라
// ApiError가 아니라 이 에러로 구분한다. message는 서버가 보낸 안내문이다.
export class ChatStreamError extends Error {
  name = "ChatStreamError";
}

interface ChatStreamEvent {
  name: string;
  data: string;
}

// 질문을 보내고 답변을 SSE로 받는다. done이 오면 끝나고, 실패는 던진다.
// 시작 전 실패는 ApiError·NetworkError, 도중 실패는 ChatStreamError, 무응답은 TimeoutError다.
// signal로 끊은 요청은 브라우저의 AbortError를 그대로 던진다(화면을 떠난 것이라 실패로 다루지 않는다).
//
// 이 요청만 apiClient(axios)를 거치지 않는다. 브라우저의 axios는 응답을 다 받은 뒤에야 넘겨줘서 조각을
// 흘려 받을 수 없고, apiClient의 10초 timeout이 답변 생성(10초 안팎)을 끊는다. 토큰·에러 클래스는 같은 것을 쓴다.
export async function streamChatMessage(
  request: ChatMessageRequest,
  handlers: ChatStreamHandlers,
  signal: AbortSignal,
): Promise<void> {
  // 무응답 타이머가 끊을 때도 같은 통로를 쓰려고 바깥 signal을 안쪽 controller로 잇는다
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });

  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  let isIdleTimedOut = false;
  // 서버는 첫 이벤트를 쓸 때 응답 헤더도 같이 보낸다 — 요청을 보낸 순간부터 재야 첫 조각 전 무응답도 잡힌다
  const restartIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdleTimedOut = true;
      controller.abort();
    }, IDLE_TIMEOUT_MS);
  };

  try {
    restartIdleTimer();
    const response = await openChatStream(request, controller.signal);
    await readChatEvents(response, handlers, restartIdleTimer);
  } catch (error) {
    if (isIdleTimedOut) {
      throw new TimeoutError("답변이 오지 않아 연결을 끊었어요.", {
        cause: error,
      });
    }
    throw error;
  } finally {
    clearTimeout(idleTimer);
    signal.removeEventListener("abort", abort);
  }
}

async function openChatStream(
  request: ChatMessageRequest,
  signal: AbortSignal,
): Promise<Response> {
  const accessToken = getAccessToken();
  let response: Response;
  try {
    response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL ?? ""}${CHAT_MESSAGES_PATH}`,
      {
        body: JSON.stringify(request),
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        method: "POST",
        signal,
      },
    );
  } catch (error) {
    // 끊은 요청(화면 이탈·무응답)은 바깥에서 가린다
    if (signal.aborted) {
      throw error;
    }
    throw new NetworkError("서버에 연결하지 못했어요.", { cause: error });
  }

  // 스트림 시작 전 실패(검증·인증)는 다른 API처럼 상태 코드 + 서버 봉투로 온다
  if (!response.ok) {
    // 토큰이 없거나 만료됐다 — apiClient와 같이 지우고 알린다(token.ts)
    if (response.status === 401) {
      clearAccessToken();
    }
    throw new ApiError(response.status, await readApiResponse(response));
  }
  return response;
}

async function readApiResponse(
  response: Response,
): Promise<ApiResponse<unknown> | undefined> {
  try {
    const body: unknown = await response.json();
    return isApiResponse(body) ? body : undefined;
  } catch (error) {
    // 게이트웨이 오류 페이지처럼 JSON이 아닌 본문 — ApiError가 상태 코드로 대신한다
    console.warn("챗봇 실패 응답 본문을 읽지 못했어요.", error);
    return undefined;
  }
}

// 본문을 빈 줄 단위로 끊어 이벤트마다 넘긴다. done을 받으면 더 읽지 않고 끝낸다.
// 서버(ChatSseWriter)는 줄바꿈을 \n으로만 쓰고 data는 한 줄 JSON이라, 빈 줄로만 나눠도 이벤트가 쪼개지지 않는다.
async function readChatEvents(
  response: Response,
  handlers: ChatStreamHandlers,
  onChunk: () => void,
): Promise<void> {
  if (!response.body) {
    throw new ChatStreamError(STREAM_CLOSED_MESSAGE);
  }
  const reader = response.body.getReader();
  // 한글 한 글자가 조각 경계에서 잘려 와도 깨지지 않게 stream 모드로 이어서 푼다
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    onChunk();
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split("\n\n");
    // 마지막 덩어리는 아직 덜 왔을 수 있어 다음 조각과 이어 붙인다
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      if (dispatchChatEvent(parseChatEvent(block), handlers)) {
        return;
      }
    }
  }

  // 마지막 이벤트 뒤에 빈 줄 없이 끝난 경우
  const rest = buffer + decoder.decode();
  if (rest.trim() && dispatchChatEvent(parseChatEvent(rest), handlers)) {
    return;
  }
  // done·error 없이 끊겼다
  throw new ChatStreamError(STREAM_CLOSED_MESSAGE);
}

function parseChatEvent(block: string): ChatStreamEvent {
  let name = "";
  let data = "";
  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      name = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      data = line.slice("data:".length).trim();
    }
  }
  return { data, name };
}

// done이면 true를 돌려 읽기를 멈추게 한다. error는 던진다.
function dispatchChatEvent(
  event: ChatStreamEvent,
  handlers: ChatStreamHandlers,
): boolean {
  switch (event.name) {
    case "delta":
      handlers.onDelta(chatDeltaDataSchema.parse(JSON.parse(event.data)).text);
      return false;
    case "bubble":
      handlers.onBubble();
      return false;
    case "done":
      return true;
    case "error":
      throw new ChatStreamError(
        chatErrorDataSchema.parse(JSON.parse(event.data)).message,
      );
    default:
      // 계약에 없는 이벤트는 건너뛴다 — 서버가 이벤트를 늘려도 지금 화면이 깨지지 않게
      return false;
  }
}
