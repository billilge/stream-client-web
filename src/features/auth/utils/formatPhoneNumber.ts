import {
  PHONE_DIGIT_COUNT,
  PHONE_PREFIX,
} from "@/features/auth/constants/auth";

/** 입력값에서 숫자만 꺼낸다(최대 11자리). */
export function toPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_COUNT);
}

/** 010으로 시작하는 숫자 11자리인지(하이픈 없는 값 기준) */
export function isValidPhoneDigits(digits: string): boolean {
  return digits.length === PHONE_DIGIT_COUNT && digits.startsWith(PHONE_PREFIX);
}

// 화면설계서 1번: 숫자만 입력해도 하이픈을 자동으로 넣는다(01012345678 → 010-1234-5678).
export function formatPhoneNumber(digits: string): string {
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
