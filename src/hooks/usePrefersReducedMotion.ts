import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// OS의 "모션 줄이기" 설정을 읽는다. 설정을 켜고 끄면 바로 반영된다(matchMedia change 구독).
//
// Tailwind의 `motion-reduce:` 변형으로 충분한 자리(ConfirmModal의 transition 등)는 그대로 두고,
// 이 훅은 CSS로 끌 수 없는 모션 — Lottie 재생 여부처럼 JS가 정해야 하는 것 — 에만 쓴다.
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
