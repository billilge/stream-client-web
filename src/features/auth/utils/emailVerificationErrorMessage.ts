import {
  EMAIL_ALREADY_EXISTS_MESSAGE,
  EMAIL_CODE_ATTEMPTS_EXCEEDED_MESSAGE,
  EMAIL_CODE_EXPIRED_MESSAGE,
  EMAIL_CODE_MISMATCH_MESSAGE,
  EMAIL_CODE_NOT_FOUND_MESSAGE,
  EMAIL_CODE_VERIFY_FAILURE_MESSAGE,
  EMAIL_NOT_VERIFIED_MESSAGE,
  EMAIL_SEND_COOLDOWN_MESSAGE,
  EMAIL_SEND_DAILY_LIMIT_MESSAGE,
  EMAIL_SEND_FAILURE_MESSAGE,
} from "@/features/auth/constants/auth";
import { isApiError } from "@/shared/api";
import { MEMBERS_ERROR_CODES } from "@/shared/entities/members/membersQueries";

// 서버 에러 코드를 토스트 문구로 바꾼다. 모르는 코드나 네트워크 실패는 단계마다 정한 "다시 시도" 문구로 둔다
// (발송 대기열이 가득 찬 EMAIL_SEND_FAILED도 다시 시도하면 되는 실패라 같은 문구다).

// 인증번호 발송(이메일 입력의 `인증번호 받기`, 인증번호 입력의 `다시 보내기`)
export function getEmailSendErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return EMAIL_SEND_FAILURE_MESSAGE;
  }
  switch (error.code) {
    case MEMBERS_ERROR_CODES.emailVerificationCooldown:
      return EMAIL_SEND_COOLDOWN_MESSAGE;
    case MEMBERS_ERROR_CODES.emailVerificationDailyLimitExceeded:
      return EMAIL_SEND_DAILY_LIMIT_MESSAGE;
    case MEMBERS_ERROR_CODES.emailAlreadyExists:
      return EMAIL_ALREADY_EXISTS_MESSAGE;
    default:
      return EMAIL_SEND_FAILURE_MESSAGE;
  }
}

// 인증번호 확인
export function getEmailCodeErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return EMAIL_CODE_VERIFY_FAILURE_MESSAGE;
  }
  switch (error.code) {
    case MEMBERS_ERROR_CODES.emailVerificationCodeMismatch:
      return EMAIL_CODE_MISMATCH_MESSAGE;
    case MEMBERS_ERROR_CODES.emailVerificationExpired:
      return EMAIL_CODE_EXPIRED_MESSAGE;
    case MEMBERS_ERROR_CODES.emailVerificationAttemptsExceeded:
      return EMAIL_CODE_ATTEMPTS_EXCEEDED_MESSAGE;
    case MEMBERS_ERROR_CODES.emailVerificationNotFound:
      return EMAIL_CODE_NOT_FOUND_MESSAGE;
    default:
      return EMAIL_CODE_VERIFY_FAILURE_MESSAGE;
  }
}

// 가입 제출이 이메일 때문에 거절됐을 때의 문구 — 이메일을 다시 인증해야 하는 실패만 문구를 주고, 나머지는 null이다
export function getSignUpEmailErrorMessage(error: unknown): string | null {
  if (!isApiError(error)) {
    return null;
  }
  switch (error.code) {
    case MEMBERS_ERROR_CODES.emailNotVerified:
      return EMAIL_NOT_VERIFIED_MESSAGE;
    case MEMBERS_ERROR_CODES.emailAlreadyExists:
      return EMAIL_ALREADY_EXISTS_MESSAGE;
    default:
      return null;
  }
}
