import type { FeePaymentStatus } from "@/entities/fee/types";

// 학생회 카카오톡 채널 — 주소를 받으면 채운다. 비어 있으면 문의하기를 눌러도 아무 일도 하지 않는다.
export const STUDENT_COUNCIL_KAKAO_CHANNEL_URL = "";

type BadgeColor = "orange" | "red" | "green";

// 홈 내 정보 목록(HomeInfoList)의 학생회비 배지와 같은 이름·색이다
export const FEE_STATUS_BADGES: Record<
  FeePaymentStatus,
  { label: string; color: BadgeColor }
> = {
  checking: { color: "orange", label: "납부확인중" },
  "needs-check": { color: "red", label: "확인필요" },
  paid: { color: "green", label: "납부완료" },
};
