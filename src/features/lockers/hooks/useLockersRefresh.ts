import { useRef, useState } from "react";

const MIN_HIDDEN_MS = 300;

// 크롬 새로고침처럼 내용을 잠깐 지웠다가 다시 받은 뒤 보여 준다. 응답이 빨라도 사라진 게 보이게
// 최소 시간을 두고, 그동안 다시 눌러도 한 번만 받는다. 사라질 때는 바로, 나타날 때만 서서히
export function useLockersRefresh(refetch: () => Promise<unknown>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const refresh = async () => {
    if (isRefreshingRef.current) {
      return;
    }
    isRefreshingRef.current = true;
    setIsRefreshing(true);
    await Promise.all([
      refetch(),
      new Promise((resolve) => setTimeout(resolve, MIN_HIDDEN_MS)),
    ]);
    isRefreshingRef.current = false;
    setIsRefreshing(false);
  };

  const fadeClassName = isRefreshing
    ? "opacity-0"
    : "opacity-100 transition-opacity duration-200 ease-out";

  return { fadeClassName, isRefreshing, refresh };
}
