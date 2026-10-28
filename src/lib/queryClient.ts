import { QueryClient } from "@tanstack/react-query";

import { isApiError } from "@/lib/api/errors";

// 서버 데이터 캐시. 화면은 entities의 queryOptions를 useSuspenseQuery로 읽고, 같은 key의 응답을 여기서 나눠 쓴다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 순간적인 네트워크 끊김·서버 오류는 한 번 더 시도한다. 4xx(401·404 등)는 다시 보내도 같아서 바로 넘긴다
      retry: (failureCount, error) =>
        !(isApiError(error) && error.status < 500) && failureCount < 1,
      // 1분 안에 다시 들어온 화면은 요청 없이 캐시를 쓴다 — 기본값(0)이면 화면에 들어갈 때마다,
      // 앱(WebView)에 다시 포커스될 때마다 다시 받는다
      staleTime: 60_000,
    },
  },
});
