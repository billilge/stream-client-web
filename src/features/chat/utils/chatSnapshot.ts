import { z } from "zod";

import type { ChatMessage } from "@/features/chat/hooks/useChatStream";

// 답변 속 출처 링크를 눌러 공지·행사 상세로 갔다가 뒤로 돌아오면 대화를 되살리기 위해 잠깐 맡겨 두는 대화.
// 대화는 화면 상태라 다른 화면으로 가면 사라진다. 링크를 누르기 직전에 sessionStorage에 넣고, 돌아와 화면이
// 다시 그려질 때 꺼낸 뒤 지운다.
//
// 키에 히스토리 항목의 key(`location.key`)를 붙인다. 뒤로가기로 돌아오면 떠날 때와 같은 key라 대화가 되살아나고,
// 홈에서 챗봇을 새로 열면 새 key라 지금처럼 새 대화로 시작한다("들어올 때마다 새 대화"는 그대로다).
// history.state에 넣지 않는 이유: 링크를 누를 때마다 지금 항목을 replace로 한 번 더 바꿔야 해서 이동이 두 번
// 일어난다. sessionStorage는 탭(앱이면 웹뷰)을 닫으면 사라져서 대화가 기기에 오래 남지 않는다.
const CHAT_SNAPSHOT_STORAGE_PREFIX = "stream:chat:snapshot:";

export interface ChatSnapshot {
  // 백엔드가 대화 이력을 이 값으로 묶는다 — 같이 되살려야 돌아와서 이어 묻는 질문도 앞 대화를 기억한다
  conversationId: string;
  messages: ChatMessage[];
}

// 저장소 값은 다른 버전의 코드가 썼을 수도 있어 모양을 검사한 뒤 쓴다. 안 맞으면 새 대화로 시작한다.
const chatSnapshotSchema = z.object({
  conversationId: z.string(),
  messages: z.array(
    z.discriminatedUnion("sender", [
      z.object({ id: z.number(), sender: z.literal("user"), text: z.string() }),
      z.object({
        bubbles: z.array(z.string()),
        id: z.number(),
        sender: z.literal("bot"),
      }),
    ]),
  ),
});

export function saveChatSnapshot(
  historyKey: string,
  snapshot: ChatSnapshot,
): void {
  try {
    window.sessionStorage.setItem(
      CHAT_SNAPSHOT_STORAGE_PREFIX + historyKey,
      JSON.stringify(snapshot),
    );
  } catch (error) {
    // 저장소가 막힌 환경(시크릿 모드 등)이면 돌아왔을 때 새 대화가 될 뿐이라 이동은 그대로 한다
    console.warn("챗봇 대화를 보관하지 못했어요.", error);
  }
}

// 읽기와 지우기를 나눈다 — 화면은 첫 렌더의 useState 초기값으로 읽는데, StrictMode(개발 서버)가 초기값 함수를
// 두 번 부른다. 읽으면서 지우면 두 번째 호출이 빈 값을 받는다. 지우기는 화면이 그려진 뒤(useEffect)에 한다.
export function readChatSnapshot(historyKey: string): ChatSnapshot | null {
  try {
    const raw = window.sessionStorage.getItem(
      CHAT_SNAPSHOT_STORAGE_PREFIX + historyKey,
    );
    if (raw === null) {
      return null;
    }
    const parsed = chatSnapshotSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch (error) {
    console.warn("보관한 챗봇 대화를 읽지 못했어요.", error);
    return null;
  }
}

// 되살린 뒤 지운다 — 남겨 두면 대화를 더 이어 간 뒤 새로고침했을 때 이미 지난 시점의 대화가 다시 뜬다.
export function clearChatSnapshot(historyKey: string): void {
  try {
    window.sessionStorage.removeItem(CHAT_SNAPSHOT_STORAGE_PREFIX + historyKey);
  } catch (error) {
    console.warn("보관한 챗봇 대화를 지우지 못했어요.", error);
  }
}
