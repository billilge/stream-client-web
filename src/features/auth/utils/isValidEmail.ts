// 이메일 형식만 본다. 허용 도메인 제한은 서버 정책이 정해지면 더한다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}
