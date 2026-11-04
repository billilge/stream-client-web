import type { z } from "zod";

import type {
  FEE_STATUSES,
  feeResponseSchema,
} from "@/shared/entities/fee/feeQueries";

// 학생 본인의 학생회비 납부 상태 — 서버(GET /v1/app/fee/me의 feeStatus) 문자열 그대로 쓴다.
// 한 번도 요청하지 않았으면 UNPAID(서버 DB에는 없고 응답에서만 쓰는 상태)다. 납부확인중(PENDING)은 아직 납부로 보지 않는다.
export type FeeStatus = (typeof FEE_STATUSES)[number];

// 납부를 요청한 뒤의 상태(납부확인중 · 확인필요 · 납부완료) — 미납이면 내역이 없다(홈에서 납부하기로 안내)
export type FeePaymentStatus = Exclude<FeeStatus, "UNPAID">;

// 내 학생회비 납부 현황(서버 FeeResponse) — 필드 설명은 feeQueries의 스키마에 있다
export type FeeResponse = z.infer<typeof feeResponseSchema>;

// POST /v1/app/fee 요청 — 송금을 마친 뒤 남은 학기 수와 그 근거인 학점이수현황 캡처를 함께 낸다
export interface FeeSubmitRequest {
  remainingSemesters: number;
  /** 업로드 때 받은 캡처의 파일 키 */
  proofImageKey: string;
}
