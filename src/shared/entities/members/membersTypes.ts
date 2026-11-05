import type { z } from "zod";

import type {
  memberResponseSchema,
  TERM_TYPES,
} from "@/shared/entities/members/membersQueries";

// 내 정보(서버 MemberResponse) — 필드 설명은 membersQueries의 스키마에 있다.
// 용어 사전(terminology.md)의 `회원 → members` 도메인이다.
export type MemberResponse = z.infer<typeof memberResponseSchema>;

// PATCH /v1/app/members/me/phone-number 요청 — 화면은 하이픈을 뺀 숫자만 보낸다(서버 저장 형식과 같다)
export interface PhoneNumberUpdateRequest {
  phoneNumber: string;
}

// 약관 종류(서버 TermType). 화면 라벨·본문은 features/auth/constants/auth.ts의 TERMS
export type TermType = (typeof TERM_TYPES)[number];

// POST /v1/app/members/sign-up 요청(서버 MemberSignUpRequest) — 전화번호는 화면이 하이픈을 뺀 숫자로 보낸다
export interface MemberSignUpRequest {
  phoneNumber: string;
  email: string;
  termAgreements: { termType: TermType; agreed: boolean }[];
}

// Figma는 "26.0.1 · 최신버전"처럼 한 줄로 보여 주지만, 버전과 최신 여부는 서버가 내려 주는
// 별개 값이라 나눠서 받는다 — 문구 조합은 화면이 한다.
export interface AppVersion {
  version: string;
  isLatest: boolean;
}
