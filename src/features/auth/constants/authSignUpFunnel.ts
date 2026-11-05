import {
  isTermType,
  type TermAgreements,
} from "@/features/auth/constants/auth";
import { TERM_TYPES } from "@/shared/entities/members/membersQueries";
import type { TermType } from "@/shared/entities/members/membersTypes";

// 가입(로그인 → [K-CONNECT 인증] → 연락처 → 이메일 입력 → 인증번호 입력 → 약관 동의 → 약관 상세 → 가입 완료) 퍼널의
// 단계와 단계별 context 타입이다. 이메일 인증은 K-CONNECT 인증을 마친 신규 사용자가 연락처 다음에 거친다.
// Figma: 스플래시 & 로그인 (nodeId 3658:112096), 온보딩 (3738:73115) / 화면설계서 3747:74283, 3747:74298 /
// 이메일 인증 작업 (4413:25855) — 이메일인증 4 (4473:48819), 이메일인증 5 (4473:48952).
export type AuthSignUpSteps = {
  login: Record<never, never>;
  phone: { name: string; phoneNumber?: string };
  email: { name: string; phoneNumber: string; email?: string };
  // codeSentAt: 인증번호를 보낸 시각(ms) — 새로고침해도 5분 타이머를 이어서 센다
  emailCode: {
    name: string;
    phoneNumber: string;
    email: string;
    codeSentAt: number;
  };
  terms: {
    name: string;
    phoneNumber: string;
    email: string;
    agreements: TermAgreements;
  };
  termsDetail: {
    name: string;
    phoneNumber: string;
    email: string;
    agreements: TermAgreements;
    termType: TermType;
  };
  complete: { name: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTermAgreements(value: unknown): value is TermAgreements {
  return (
    isRecord(value) &&
    TERM_TYPES.every((termType) => typeof value[termType] === "boolean")
  );
}

// 새로고침이나 주소 직접 입력처럼 앞 단계의 값이 없는 채로 중간 단계에 들어오면 guard가 걸러서 첫 단계(로그인)로
// 돌려보낸다 — 이름·연락처·이메일 없이 약관 동의 화면이 열리는 일이 없다.
export const AUTH_SIGN_UP_STEP_OPTIONS = {
  complete: {
    guard: (data: unknown): data is AuthSignUpSteps["complete"] =>
      isRecord(data) && typeof data.name === "string",
  },
  email: {
    guard: (data: unknown): data is AuthSignUpSteps["email"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phoneNumber === "string" &&
      (data.email === undefined || typeof data.email === "string"),
  },
  emailCode: {
    guard: (data: unknown): data is AuthSignUpSteps["emailCode"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phoneNumber === "string" &&
      typeof data.email === "string" &&
      typeof data.codeSentAt === "number",
  },
  login: {
    guard: (data: unknown): data is AuthSignUpSteps["login"] => isRecord(data),
  },
  phone: {
    guard: (data: unknown): data is AuthSignUpSteps["phone"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      (data.phoneNumber === undefined || typeof data.phoneNumber === "string"),
  },
  terms: {
    guard: (data: unknown): data is AuthSignUpSteps["terms"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phoneNumber === "string" &&
      typeof data.email === "string" &&
      isTermAgreements(data.agreements),
  },
  termsDetail: {
    guard: (data: unknown): data is AuthSignUpSteps["termsDetail"] =>
      isRecord(data) &&
      typeof data.name === "string" &&
      typeof data.phoneNumber === "string" &&
      typeof data.email === "string" &&
      isTermAgreements(data.agreements) &&
      typeof data.termType === "string" &&
      isTermType(data.termType),
  },
};
