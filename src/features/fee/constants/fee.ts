import type { FeePaymentStatus } from "@/entities/fee/types";

// 학생회 카카오톡 채널 — 주소를 받으면 채운다. 비어 있으면 문의하기를 눌러도 아무 일도 하지 않는다.
export const STUDENT_COUNCIL_KAKAO_CHANNEL_URL = "";

// 학생회비 납부 상태 배지 — 납부내역 카드와 홈 내 정보 목록(HomeInfoList)이 같이 쓴다
// Figma: 학생회비 납부 여부 뱃지 (nodeId 3147:146475)
export const FEE_STATUS_BADGES: Record<
  FeePaymentStatus,
  { label: string; color: "orange" | "red" | "green" }
> = {
  checking: { color: "orange", label: "납부확인중" },
  "needs-check": { color: "red", label: "확인필요" },
  paid: { color: "green", label: "납부완료" },
};

// 학생회비 납부내역 화면 경로
export const FEE_PAYMENTS_PATH = "/my/fee";
