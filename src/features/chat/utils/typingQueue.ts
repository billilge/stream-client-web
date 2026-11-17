// 받은 답변 조각을 바로 붙이지 않고 쌓아 두었다가 일정한 속도로 조금씩 꺼내 주는 대기열.
// AI 게이트웨이가 답변을 40자 안팎씩 0.2초마다 몰아서 보내서, 받는 대로 붙이면 몇 줄씩 뚝뚝 끊겨 보인다.
// 그래서 TICK_MS마다 몇 글자씩만 꺼내 말풍선에 붙인다 — 화면에서는 글자가 흘러가듯 나온다.

// 몇 ms마다 꺼낼지. 화면 갱신(약 16ms)보다 길게 잡아 렌더링이 밀리지 않게 한다
const TICK_MS = 30;
// 한 번에 꺼낼 최소 글자 수. 30ms에 2글자 ≈ 초당 66글자로, 눈으로 따라 읽을 만한 속도다
const MIN_CHARS_PER_TICK = 2;
// 밀린 글자를 몇 번 안에 따라잡을지. 20번 × 30ms ≈ 0.6초 — 답변이 한꺼번에 많이 와도
// 받은 것보다 1초 넘게 늦게 보이지 않도록, 밀린 만큼 한 번에 꺼내는 양을 늘린다
const CATCH_UP_TICKS = 20;

interface PendingBubble {
  // 아직 화면에 붙이지 않은 글자. 이모지가 반으로 잘리지 않게 글자(코드 포인트) 단위로 나눠 둔다
  chars: string[];
  // 이 글자들이 새 말풍선에서 시작하는지 — 첫 글자를 꺼낼 때 한 번만 참이다
  opensBubble: boolean;
}

export interface TypingQueue {
  // 받은 조각을 쌓는다. opensBubble이면 앞 말풍선과 섞이지 않게 새 칸으로 쌓는다
  push: (text: string, opensBubble: boolean) => void;
  // 스트림이 끝났다 — 남은 글자를 마저 꺼내고, 다 꺼내면 끝나는 Promise를 돌려준다
  finish: () => Promise<void>;
  // 실패·화면 떠남 — 남은 글자를 버리고 멈춘다
  cancel: () => void;
}

export function createTypingQueue(
  reveal: (text: string, opensBubble: boolean) => void,
): TypingQueue {
  const pending: PendingBubble[] = [];
  let timer: ReturnType<typeof setInterval> | null = null;
  let isStreamDone = false;
  let resolveFinish: (() => void) | null = null;

  function pendingCount() {
    return pending.reduce((sum, bubble) => sum + bubble.chars.length, 0);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function tick() {
    const bubble = pending[0];
    if (!bubble) {
      stop();
      if (isStreamDone) {
        resolveFinish?.();
      }
      return;
    }
    const count = Math.max(
      MIN_CHARS_PER_TICK,
      Math.ceil(pendingCount() / CATCH_UP_TICKS),
    );
    const size = takeSize(
      bubble.chars,
      count,
      isStreamDone || pending.length > 1,
    );
    if (size === 0) {
      // 굵게·링크 표시가 닫히는 글자를 아직 못 받았다 — 다음 조각을 기다린다
      return;
    }
    const text = bubble.chars.splice(0, size).join("");
    reveal(text, bubble.opensBubble);
    bubble.opensBubble = false;
    if (bubble.chars.length === 0) {
      pending.shift();
    }
  }

  function start() {
    if (timer === null) {
      timer = setInterval(tick, TICK_MS);
    }
  }

  return {
    cancel() {
      pending.length = 0;
      stop();
      resolveFinish?.();
    },
    finish() {
      isStreamDone = true;
      return new Promise((resolve) => {
        resolveFinish = resolve;
        start();
      });
    },
    push(text, opensBubble) {
      const chars = Array.from(text);
      const last = pending.at(-1);
      if (last && !opensBubble) {
        last.chars.push(...chars);
      } else {
        pending.push({ chars, opensBubble });
      }
      start();
    },
  };
}

// 이번에 꺼낼 글자 수. 굵게(`**…**`)와 링크(`[제목](주소)`)는 한 번에 꺼낸다 — 한 글자씩 꺼내면
// 닫는 표시가 오기 전까지 `**`나 `[`가 글자 그대로 보였다가 갑자기 굵어지거나 링크로 바뀌어 번쩍인다.
// 닫는 표시를 아직 못 받았으면 0을 돌려 기다린다. 더 받을 글자가 없으면(isComplete) 있는 그대로 꺼낸다.
function takeSize(chars: string[], count: number, isComplete: boolean): number {
  let size = 0;
  while (size < count && size < chars.length) {
    const rest = chars.slice(size).join("");
    const tokenLength = markdownTokenLength(rest);
    if (tokenLength === null) {
      size += 1;
      continue;
    }
    if (tokenLength === 0) {
      // 닫는 표시가 아직 안 왔다. 앞에 꺼낼 글자가 있으면 거기까지만 꺼낸다
      return size > 0 || !isComplete ? size : chars.length;
    }
    size += Array.from(rest.slice(0, tokenLength)).length;
  }
  return size;
}

// text가 굵게·링크 표시로 시작하면 그 표시 전체의 길이(UTF-16 기준), 닫히지 않았으면 0, 표시가 아니면 null
function markdownTokenLength(text: string): number | null {
  if (text.startsWith("**")) {
    const close = text.indexOf("**", 2);
    return close === -1 ? 0 : close + 2;
  }
  if (text.startsWith("[")) {
    const link = text.match(/^\[[^\]\n]*\]\([^)\n]*\)/);
    if (link) {
      return link[0].length;
    }
    // 아직 링크가 되다 만 모양이면(`[제목`, `[제목]`, `[제목](/no`) 뒤 글자를 기다린다.
    // `[취소] 영화 상영회`처럼 링크가 아닌 대괄호는 그냥 글자다
    return /^\[[^\]\n]*(\](\([^)\n]*)?)?$/.test(text) ? 0 : null;
  }
  return null;
}
