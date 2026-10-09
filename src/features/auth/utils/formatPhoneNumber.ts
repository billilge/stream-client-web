import { PHONE_DIGIT_COUNT } from "@/features/auth/constants/auth";

/** 입력값에서 숫자만 꺼낸다(최대 11자리). */
export function toPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_COUNT);
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
