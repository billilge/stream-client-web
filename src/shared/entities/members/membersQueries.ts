import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

import { mockupResponse } from "@/lib/mockupApi";
import { api } from "@/shared/api";
import { membersKeys } from "@/shared/entities/members/membersKeys";
import { APP_VERSION } from "@/shared/entities/members/membersMock";
import type { PhoneNumberUpdateRequest } from "@/shared/entities/members/membersTypes";

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

// 전화번호 변경에서 화면이 갈라 처리하는 서버 에러 코드(MemberErrorCode)
export const MEMBERS_ERROR_CODES = {
  // 다른 회원이 이미 쓰는 번호다(409)
  phoneNumberAlreadyExists: "PHONE_NUMBER_ALREADY_EXISTS",
} as const;

// 전화번호 변경(PATCH /v1/app/members/me/phone-number). 서버는 하이픈이 있든 없든 숫자만 남겨 저장하고,
// 지금 번호와 같으면 바꾸지 않고 성공으로 응답한다.
// 성공하면 내 정보를 무효화해서 설정 화면 계정 정보 카드가 새 번호를 다시 받게 한다.
export function useUpdatePhoneNumberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // 응답 data는 null이라 쓰지 않는다
    mutationFn: async (request: PhoneNumberUpdateRequest) => {
      await api.patch<unknown>(`${MEMBERS_PATH}/me/phone-number`, request);
    },
    // Promise를 돌려줘서 무효화가 끝난 뒤에 mutation이 끝나게 한다
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: membersKeys.me() }),
  });
}
