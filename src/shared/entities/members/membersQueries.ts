import { queryOptions } from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { membersKeys } from "@/shared/entities/members/membersKeys";
import { APP_VERSION, MY_ACCOUNT } from "@/shared/entities/members/membersMock";

// 실 API가 붙으면 queryFn 안쪽만 요청 코드로 바꾼다 — 화면은 이 queryOptions로만 데이터를 받는다.
//
// 설정 화면은 묶음 이름이고 데이터는 서버 회원 API(`/v1/app/members`)와 같은 `members` 도메인이다
// (terminology.md에 `settings`는 없다).
export const membersQueries = {
  myAccount: () =>
    queryOptions({
      queryKey: membersKeys.myAccount(),
      queryFn: () => mockupResponse(() => MY_ACCOUNT),
    }),
  appVersion: () =>
    queryOptions({
      queryKey: membersKeys.appVersion(),
      queryFn: () => mockupResponse(() => APP_VERSION),
    }),
};
