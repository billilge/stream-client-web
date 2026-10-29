// 전화번호 입력 공용 로직 — 설정의 전화번호 변경과 온보딩 연락처 입력(#110)이 같이 쓴다.
// React와 무관한 순수 함수라 화면 파일이 아니라 여기에 둔다.

/** `010-1234-5678` 13자. 입력칸 maxLength가 이 값에 묶인다. */
export const PHONE_NUMBER_MAX_LENGTH = 13;

/** 하이픈을 뺀 숫자 자릿수 */
const PHONE_DIGIT_COUNT = 11;

// 통과 기준을 `010`으로 고정한다. 01X(011·016~019)는 2G 종료와 함께 전부 010으로 번호이동이
// 끝나서 지금 새로 입력될 일이 없다. 서버 검증 규칙이 더 넓으면 이 정규식만 넓히면 된다.
const PHONE_NUMBER_PATTERN = /^010-\d{4}-\d{4}$/;

/** 입력값에서 숫자만 꺼낸다(최대 11자리) */
export function toPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_COUNT);
}

// 입력하는 대로 하이픈을 끼운다(Figma 입력 중 상태 3524:152465가 `010-1234-5` 형태).
// 숫자가 아닌 글자를 섞어 쳐도 숫자만 걸러서 포맷한다.
export function formatPhoneNumber(value: string): string {
  const digits = toPhoneDigits(value);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/** 포맷된 번호가 저장할 수 있는 형태인지 — 버튼 활성화 조건이다 */
export function isValidPhoneNumber(value: string): boolean {
  return PHONE_NUMBER_PATTERN.test(value);
}
