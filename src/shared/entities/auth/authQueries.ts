import { api, setAccessToken } from "@/shared/api";
import type {
  KConnectLoginResponse,
  KConnectUser,
  OnboardingSubmission,
} from "@/shared/entities/auth/authTypes";

// 서버로 보내는 K-CONNECT 인증 결과 — @billilge/oauth-kconnect가 돌려주는 값 중 서버가 쓰는 세 가지다.
export interface KConnectCredentials {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

// K-CONNECT 로그인 화면을 거쳐 돌려받은 `{ code, codeVerifier, redirectUri }`를 서버로 보내 서비스 로그인을 마친다.
// 서버가 K-CONNECT 토큰 교환과 재학생 확인을 하고 서비스 액세스 토큰을 내려 준다(POST /v1/auth/login/kconnect).
// 토큰은 가입을 마치지 않은 회원에게도 내려오므로 여기서 바로 저장하고, 로그인 표시(markLoggedIn)는 호출하는 쪽이
// 가입 여부(`isNewUser`)를 보고 남긴다 — 신규 사용자는 가입 제출 요청에 이 토큰이 필요하다.
export async function exchangeKConnectCode(
  credentials: KConnectCredentials,
): Promise<KConnectUser> {
  const response = await api.post<KConnectLoginResponse>(
    "/v1/auth/login/kconnect",
    credentials,
  );
  setAccessToken(response.accessToken);
  return { isNewUser: response.signUpRequired, name: response.name };
}

const EMAIL_VERIFICATIONS_PATH = "/v1/app/members/email-verifications";

// 이메일 인증·가입에서 화면이 갈라 처리하는 서버 에러 코드(EmailVerificationErrorCode, MemberErrorCode)
export const AUTH_ERROR_CODES = {
  // 1분 안에 다시 보냈다(429)
  emailVerificationCooldown: "EMAIL_VERIFICATION_COOLDOWN",
  // 오늘(자정 기준) 10번을 모두 보냈다(429)
  emailVerificationDailyLimitExceeded:
    "EMAIL_VERIFICATION_DAILY_LIMIT_EXCEEDED",
  // 다른 회원이 이미 쓰는 이메일이다 — 발송과 가입 모두에서 온다(409)
  emailAlreadyExists: "EMAIL_ALREADY_EXISTS",
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
  await api.post("/v1/app/members/sign-up", {
    email: submission.email,
    phoneNumber: submission.phone,
    termAgreements: [
      { termType: "PRIVACY_POLICY", agreed: true },
      { termType: "TERMS_OF_SERVICE", agreed: true },
    ],
  });
}
