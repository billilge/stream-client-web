import { queryOptions } from "@tanstack/react-query";

import { NOTIFICATIONS } from "@/entities/notifications/notificationsMock";
import { mockupResponse } from "@/lib/mockupApi";

const notificationsKeys = {
  root: () => ["notifications"] as const,
  list: () => [...notificationsKeys.root(), "list"] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const notificationsQueries = {
  list: () =>
    queryOptions({
      queryKey: notificationsKeys.list(),
      queryFn: () => mockupResponse(() => NOTIFICATIONS),
    }),
};
