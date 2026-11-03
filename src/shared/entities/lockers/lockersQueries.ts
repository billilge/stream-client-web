import { queryOptions } from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";
import { LOCKER_ASSIGNMENT_MOCK } from "@/shared/entities/lockers/lockersMock";

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
export const lockersQueries = {
  myAssignment: () =>
    queryOptions({
      queryKey: lockersKeys.myAssignment(),
      queryFn: () => mockupResponse(() => LOCKER_ASSIGNMENT_MOCK),
    }),
};
