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
import type {
  OnboardingSubmission,
  PhoneNumberUpdateRequest,
} from "@/shared/entities/members/membersTypes";

const MEMBERS_PATH = "/v1/app/members";
const EMAIL_VERIFICATIONS_PATH = `${MEMBERS_PATH}/email-verifications`;

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

// 전화번호 변경·이메일 인증·가입에서 화면이 갈라 처리하는 서버 에러 코드(MemberErrorCode, EmailVerificationErrorCode)
export const MEMBERS_ERROR_CODES = {
  // 다른 회원이 이미 쓰는 번호다(409)
  phoneNumberAlreadyExists: "PHONE_NUMBER_ALREADY_EXISTS",
  // 다른 회원이 이미 쓰는 이메일이다 — 발송과 가입 모두에서 온다(409)
  emailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  // 1분 안에 다시 보냈다(429)
  emailVerificationCooldown: "EMAIL_VERIFICATION_COOLDOWN",
  // 오늘(자정 기준) 10번을 모두 보냈다(429)
  emailVerificationDailyLimitExceeded:
    "EMAIL_VERIFICATION_DAILY_LIMIT_EXCEEDED",
  // 이 이메일로 받은 인증번호가 없다 — 다른 이메일로 새로 받았거나 아직 받지 않았다
  emailVerificationNotFound: "EMAIL_VERIFICATION_NOT_FOUND",
  // 받은 지 5분이 지났다
  emailVerificationExpired: "EMAIL_VERIFICATION_EXPIRED",
  emailVerificationCodeMismatch: "EMAIL_VERIFICATION_CODE_MISMATCH",
  // 5번 틀려서 이 인증번호로는 더 확인할 수 없다
  emailVerificationAttemptsExceeded: "EMAIL_VERIFICATION_ATTEMPTS_EXCEEDED",
  // 가입 때 인증하지 않았거나 인증한 지 30분이 지났다
  emailNotVerified: "EMAIL_NOT_VERIFIED",
} as const;

// 이메일로 6자리 인증번호를 보낸다(POST /v1/app/members/email-verifications). 다시 보내기도 같은 함수를 쓰고, 새로
// 받으면 앞서 받은 번호는 쓸 수 없다. 서버는 메일을 발송 대기열에 넣은 직후 응답해서 성공이 메일 도착을 보장하지 않는다.
export async function requestEmailVerification(email: string): Promise<void> {
  await api.post(EMAIL_VERIFICATIONS_PATH, { email });
}

// 가장 최근에 받은 인증번호를 확인한다(POST /v1/app/members/email-verifications/confirm). 이메일은 받을 때와 같아야 하고,
// 인증한 뒤 30분 안에 가입을 마쳐야 한다.
export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<void> {
  await api.post(`${EMAIL_VERIFICATIONS_PATH}/confirm`, { code, email });
}

// 가입 제출(POST /v1/app/members/sign-up) — 로그인 때 받은 토큰으로 전화번호·인증한 이메일·약관 동의를 서버에 남긴다.
// 필수 약관 둘은 동의해야만 이 단계에 오므로 항상 동의로 보낸다. 선택 약관(알림 수신)은 서버에 약관 종류가 생기면
// (stream-server #229) 보낸다 — 지금은 보내지 않는다.
export async function submitOnboarding(
  submission: OnboardingSubmission,
): Promise<void> {
  await api.post(`${MEMBERS_PATH}/sign-up`, {
    email: submission.email,
    phoneNumber: submission.phone,
    termAgreements: [
      { termType: "PRIVACY_POLICY", agreed: true },
      { termType: "TERMS_OF_SERVICE", agreed: true },
    ],
  });
}

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
