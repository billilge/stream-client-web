import { useEffect, useRef } from "react";

interface InfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  fetchNextPage: () => unknown;
}

// 목록 끝에 둔 요소(돌려주는 ref)가 보이면 다음 페이지를 받는다 — useSuspenseInfiniteQuery 결과를 그대로 넘긴다.
// 다음 페이지 요청이 실패하면 멈춘다. 끝 요소가 계속 보이는 상태라 그대로 두면 실패한 요청을 끝없이 다시 보낸다.
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
}: InfiniteScrollOptions) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (
      !trigger ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetchNextPageError
    ) {
      return;
    }
    // 받은 페이지가 짧아 끝 요소가 그대로 보이면, 다시 관찰을 시작하자마자 알림이 와서 다음 페이지를 이어 받는다
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  return triggerRef;
}
