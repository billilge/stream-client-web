import { useCallback, useEffect, useRef, useState } from "react";

// 딥링크를 띄운 뒤 이 시간 안에 화면이 가려지지 않으면 "안 열렸다"고 본다.
// 앱 전환은 보통 1초 안에 끝나고, 너무 짧게 잡으면 느린 기기에서 멀쩡히 열린 걸 실패로 센다.
const LAUNCH_TIMEOUT_MS = 1_500;

type LaunchPhase = "idle" | "launching" | "left";

interface UseTossDeepLinkOptions {
  /** 앱이 안 열렸다고 판단했을 때 */
  onFail: () => void;
  /** 앱에 갔다가 이 화면으로 돌아왔을 때 */
  onReturn: () => void;
}

/**
 * 토스 같은 커스텀 스킴(`supertoss://`)을 열고, 앱에 다녀왔는지를 추정한다.
 *
 * 브라우저는 커스텀 스킴이 실제로 열렸는지 알려주지 않는다 — `window.open`은 앱이 없어도
 * 창 객체를 돌려주고, `location.href` 대입은 아무 신호도 남기지 않는다. 그래서 표준적인
 * 방법대로 "앱으로 전환되면 이 탭이 가려진다"는 성질을 쓴다.
 *
 *   열기 → 타이머 시작
 *     ├ 1.5초 안에 화면이 가려짐  → 앱으로 갔다("left"). 다시 보이면 onReturn
 *     └ 가려지지 않은 채 타이머 울림 → 안 열렸다. onFail
 *
 * 데스크톱 브라우저에서는 전환이 일어나지 않아 항상 실패로 떨어진다 — 실패 화면을 확인하기엔
 * 오히려 편하다.
 */
export function useTossDeepLink({ onFail, onReturn }: UseTossDeepLinkOptions) {
  const [phase, setPhase] = useState<LaunchPhase>("idle");
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    const handleVisibility = () => {
      if (phase === "launching" && document.visibilityState === "hidden") {
        // 앱으로 전환됐다 — 실패 판정을 취소하고 복귀를 기다린다
        clearTimer();
        setPhase("left");
        return;
      }
      if (phase === "left" && document.visibilityState === "visible") {
        setPhase("idle");
        onReturn();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    // iOS Safari는 앱 전환 때 visibilitychange 대신 pagehide만 주는 경우가 있다
    window.addEventListener("pagehide", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handleVisibility);
    };
  }, [phase, clearTimer, onReturn]);

  // 화면을 떠날 때 타이머가 남아 있으면 엉뚱한 시점에 실패 처리가 돈다
  useEffect(() => clearTimer, [clearTimer]);

  const open = useCallback(
    (url: string) => {
      if (!url) {
        onFail();
        return;
      }
      setPhase("launching");
      // 커스텀 스킴은 window.open보다 location 대입이 막히는 경우가 적다
      window.location.href = url;
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setPhase("idle");
        onFail();
      }, LAUNCH_TIMEOUT_MS);
    },
    [onFail],
  );

  return { open };
}
