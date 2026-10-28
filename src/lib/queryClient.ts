import { QueryClient } from "@tanstack/react-query";

// 서버 데이터 캐시. 화면은 entities의 queryOptions를 useSuspenseQuery로 읽고, 같은 key의 응답을 여기서 나눠 쓴다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 순간적인 네트워크 끊김은 한 번 더 시도하고, 그래도 실패하면 바로 에러로 넘긴다
      retry: 1,
    },
  },
});
