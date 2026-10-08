// 학생회비 계좌 송금 플로우 경로. 화면설계서(687:20584)에는 경로 표기 컬럼이 아예 없어서
// 용어 사전(terminology.md)의 `회비 납부 → fee`와 "프론트 라우트 경로: /{코드 용어}" 규칙으로 정했다.
export const FEE_TRANSFER_PATHS = {
  complete: "/fee/transfer/complete",
  confirm: "/fee/transfer/confirm",
  semester: "/fee/transfer/semester",
  toss: "/fee/transfer/toss",
  transcript: "/fee/transfer/transcript",
} as const;

// 아직 받지 못한 외부 연동 주소들. 값이 있을 때만 열도록 해서 빈 창이 뜨는 걸 막는다
// (설정 화면의 SETTINGS_EXTERNAL_LINKS와 같은 방식).
//
// - kSmartMentor: 학점이수현황을 확인하는 국민대 K-스마트멘토 주소
// - tossTransfer: 계좌·금액이 채워진 토스 송금 딥링크. 학생회 계좌와 납부 금액 규칙이 정해져야
//   만들 수 있다(남은 학기 수에 따라 금액이 달라진다).
export const FEE_EXTERNAL_LINKS = {
  kSmartMentor: "",
  tossTransfer: "",
} as const;

// 업로드 받는 이미지 형식 — 학점이수현황 "캡처"라 스크린샷 확장자만 받는다
export const FEE_TRANSCRIPT_ACCEPT = "image/png,image/jpeg,image/webp";
