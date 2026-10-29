import type { FeePaymentStatus } from "@/entities/fee/types";

// 학생회비 계좌 송금 플로우 경로. 화면설계서(687:20584)에는 경로 표기 컬럼이 아예 없어서
// 용어 사전(terminology.md)의 `회비 납부 → fee`와 "프론트 라우트 경로: /{코드 용어}" 규칙으로 정했다.
// 단계(남은 학기 수·캡처 업로드·토스 이동·송금 확인·완료)는 이 경로 하나 안에서 useFunnel이
// `?fee.step=`으로 나눈다 — 로그인·온보딩 퍼널(`/auth`)과 같은 방식이다.
export const FEE_TRANSFER_PATH = "/fee/transfer";

// 학생회비 납부내역 화면 경로
export const FEE_PAYMENTS_PATH = "/my/fee";

// 아직 받지 못한 외부 연동 주소들. 값이 있을 때만 열도록 해서 빈 창이 뜨는 걸 막는다.
//
// - kSmartMentor: 학점이수현황을 확인하는 국민대 K-스마트멘토 주소
// - studentCouncilKakaoChannel: 학생회 카카오톡 채널. 비어 있으면 확인필요 카드에
//   문의하기 버튼을 그리지 않는다.
// - tossTransfer: 계좌·금액이 채워진 토스 송금 딥링크. 학생회 계좌와 납부 금액 규칙이 정해져야
//   만들 수 있다(남은 학기 수에 따라 금액이 달라진다).
export const FEE_EXTERNAL_LINKS = {
  kSmartMentor: "",
  studentCouncilKakaoChannel: "",
  tossTransfer: "",
} as const;

// 업로드 받는 이미지 형식 — 학점이수현황 "캡처"라 스크린샷 확장자만 받는다
export const FEE_TRANSCRIPT_ACCEPT = "image/png,image/jpeg,image/webp";

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
