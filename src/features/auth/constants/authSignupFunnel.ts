import {
  isTermsId,
  TERMS_IDS,
  type TermsAgreements,
  type TermsId,
} from "@/features/auth/constants/auth";

// 가입(로그인 → [K-CONNECT 인증] → 이메일 입력 → 인증번호 입력 → 연락처 → 약관 동의 → 약관 상세 → 가입 완료) 퍼널의
// 단계와 단계별 context 타입이다. 이메일 인증은 K-CONNECT 인증을 마친 신규 사용자가 연락처 전에 거친다.
// Figma: 스플래시 & 로그인 (nodeId 3658:112096), 온보딩 (3738:73115) / 화면설계서 3747:74283, 3747:74298 /
// 이메일 인증 작업 (4413:25855) — 이메일인증 4 (4473:48819), 이메일인증 5 (4473:48952).
export type AuthSignupSteps = {
  login: Record<never, never>;
  email: { name: string; email?: string };
  emailCode: { name: string; email: string };
  phone: { name: string; phone?: string };
  terms: { name: string; phone: string; agreements: TermsAgreements };
  termsDetail: {
    name: string;
    phone: string;
    agreements: TermsAgreements;
    termsId: TermsId;
  };
  complete: { name: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTermsAgreements(value: unknown): value is TermsAgreements {
  return (
    isRecord(value) && TERMS_IDS.every((id) => typeof value[id] === "boolean")
  );
}

// 새로고침이나 주소 직접 입력처럼 앞 단계의 값이 없는 채로 중간 단계에 들어오면 guard가 걸러서 첫 단계(로그인)로
// 돌려보낸다 — 이름이나 연락처 없이 약관 동의 화면이 열리는 일이 없다.
export const AUTH_SIGNUP_STEP_OPTIONS = {
  complete: {
    guard: (data: unknown): data is AuthSignupSteps["complete"] =>
      isRecord(data) && typeof data.name === "string",
  },
  email: {
    guard: (data: unknown): data is AuthSignupSteps["email"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      (data.email === undefined || typeof data.email === "string"),
  },
  emailCode: {
    guard: (data: unknown): data is AuthSignupSteps["emailCode"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.email === "string",
  },
  login: {
    guard: (data: unknown): data is AuthSignupSteps["login"] => isRecord(data),
  },
  phone: {
    guard: (data: unknown): data is AuthSignupSteps["phone"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      (data.phone === undefined || typeof data.phone === "string"),
  },
  terms: {
    guard: (data: unknown): data is AuthSignupSteps["terms"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phone === "string" &&
      isTermsAgreements(data.agreements),
  },
  termsDetail: {
    guard: (data: unknown): data is AuthSignupSteps["termsDetail"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phone === "string" &&
      isTermsAgreements(data.agreements) &&
      typeof data.termsId === "string" &&
      isTermsId(data.termsId),
  },
};
