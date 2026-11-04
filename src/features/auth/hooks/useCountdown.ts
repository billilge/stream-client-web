import { useEffect, useState } from "react";

// 마감 시각(ms)까지 남은 초를 센다. 틱마다 1을 빼지 않고 마감 시각까지 남은 시간을 다시 계산해서, 탭이 백그라운드에
// 있다 돌아오거나 타이머가 밀려도 어긋나지 않는다. 마감 시각은 호출하는 쪽이 들고 있어서 새로고침해도 이어서 센다.
export function useCountdown(endAt: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(endAt),
  );

  useEffect(() => {
    const tick = () => setRemainingSeconds(getRemainingSeconds(endAt));
    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [endAt]);

  return remainingSeconds;
}

function getRemainingSeconds(endAt: number) {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
}
