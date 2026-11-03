// 남은 초를 `04:59`처럼 분:초 두 자리로 나타낸다(Figma 이메일인증 5의 타이머)
export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
