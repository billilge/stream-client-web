import { useCallback, useEffect, useState } from "react";

// 인증번호 유효 시간을 센다. 틱마다 1을 빼지 않고 마감 시각까지 남은 시간을 다시 계산해서, 탭이 백그라운드에
// 있다 돌아오거나 타이머가 밀려도 어긋나지 않는다. restart는 "다시 보내기"로 새 인증번호를 받았을 때 부른다.
export function useCountdown(seconds: number) {
  const [endAt, setEndAt] = useState(() => Date.now() + seconds * 1000);
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  useEffect(() => {
    const tick = () =>
      setRemainingSeconds(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [endAt]);

  const restart = useCallback(() => {
    setEndAt(Date.now() + seconds * 1000);
  }, [seconds]);

  return { remainingSeconds, restart };
}
