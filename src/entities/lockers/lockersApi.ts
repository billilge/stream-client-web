import { queryOptions } from "@tanstack/react-query";

import { LOCKER_ASSIGNMENT_MOCK } from "@/entities/lockers/lockersMock";
import { mockupResponse } from "@/lib/mockupApi";

const lockersKeys = {
  root: () => ["lockers"] as const,
  myAssignment: () => [...lockersKeys.root(), "assignment"] as const,
};

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const lockersQueries = {
  myAssignment: () =>
    queryOptions({
      queryKey: lockersKeys.myAssignment(),
      queryFn: () => mockupResponse(() => LOCKER_ASSIGNMENT_MOCK),
    }),
};
