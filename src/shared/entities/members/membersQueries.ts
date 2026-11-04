import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { mockupResponse } from "@/lib/mockupApi";
import { api } from "@/shared/api";
import { membersKeys } from "@/shared/entities/members/membersKeys";
import { APP_VERSION } from "@/shared/entities/members/membersMock";

const MEMBERS_PATH = "/v1/app/members";

// 내 정보(서버 MemberResponse) — 설정 화면 계정 정보 카드가 쓴다.
export const memberResponseSchema = z.looseObject({
  name: z.string(),
  // 이메일을 등록하지 않은 회원은 null이다 — 가입 때 아직 이메일을 보내지 않아서 대부분 null이다
  email: z.string().nullable(),
  // 하이픈 없이 숫자만 온다("01012345678"). 가입 전 회원·이관 회원은 서버에 번호가 없어 null이다
  phoneNumber: z.string().nullable(),
});

// 화면은 이 queryOptions로만 데이터를 받는다. 화면 모양으로 바꿔야 하면 화면 쪽에서 바꾼다.
//
// 설정 화면은 묶음 이름이고 데이터는 서버 회원 API(`/v1/app/members`)와 같은 `members` 도메인이다
// (terminology.md에 `settings`는 없다).
export const membersQueries = {
  // 내 정보(GET /v1/app/members/me)
  me: () =>
    queryOptions({
      queryKey: membersKeys.me(),
      queryFn: async ({ signal }) =>
        memberResponseSchema.parse(
          await api.get<unknown>(`${MEMBERS_PATH}/me`, { signal }),
        ),
    }),
  // 앱 버전은 서버에 API가 없어서 아직 목데이터다
  appVersion: () =>
    queryOptions({
      queryKey: membersKeys.appVersion(),
      queryFn: () => mockupResponse(() => APP_VERSION),
    }),
};
