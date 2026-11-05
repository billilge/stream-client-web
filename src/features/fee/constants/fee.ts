import type { FeePaymentStatus } from "@/shared/entities/fee/feeTypes";

// 학생회비 계좌 송금 플로우 경로. 화면설계서(687:20584)에는 경로 표기 컬럼이 아예 없어서
// 용어 사전(terminology.md)의 `회비 납부 → fee`와 "프론트 라우트 경로: /{코드 용어}" 규칙으로 정했다.
// 단계(남은 학기 수·캡처 업로드·토스 이동·송금 확인·완료)는 이 경로 하나 안에서 useFunnel이
// `?fee.step=`으로 나눈다 — 로그인·온보딩 퍼널(`/login`)과 같은 방식이다.
export const FEE_TRANSFER_PATH = "/fee/transfer";

// 학생회비 납부내역 화면 경로
export const FEE_PAYMENTS_PATH = "/my/fee";

// 납부내역 카드 제목 — 서버 응답에 없는 값이라 화면이 들고 있는다
export const FEE_TITLE = "소프트웨어융합대학 학생회비";

// 아직 받지 못한 외부 연동 주소들. 값이 있을 때만 열도록 해서 빈 창이 뜨는 걸 막는다.
//
// - studentCouncilKakaoChannel: 학생회 카카오톡 채널. 비어 있으면 확인필요 카드에
//   문의하기 버튼을 그리지 않는다.
//
// 토스 송금 딥링크는 남은 학기 수마다 금액이 달라서 서버가 계산해 준다(feeQueries.transferGuide).
// K스마트멘토 주소는 운영진이 등록하는 서비스 링크(serviceLinksQueries의 kSmartMentorUrl)로 받는다.
export const FEE_EXTERNAL_LINKS = {
  studentCouncilKakaoChannel: "",
} as const;

// 업로드 받는 이미지 형식 — 학점이수현황 "캡처"라 스크린샷 확장자만 받는다
export const FEE_TRANSCRIPT_ACCEPT = "image/png,image/jpeg,image/webp";

// 서버 업로드 정책(FileUploadPolicy의 FEE_TRANSCRIPT_IMAGE)과 같은 값. 서버는 MIME이 아니라
// 파일 이름의 확장자로 판단해서, `accept`를 통과해도 이름에 확장자가 없으면 거절한다.
const FEE_TRANSCRIPT_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const FEE_TRANSCRIPT_MAX_BYTES = 10 * 1024 * 1024;

// 서버가 받아 줄 캡처인지 — 송금하러 가기 전에 걸러야 해서 고를 때 먼저 본다
export function isAcceptableTranscript(file: File): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (
    file.name.includes(".") &&
    FEE_TRANSCRIPT_EXTENSIONS.includes(extension) &&
    file.size > 0 &&
    file.size <= FEE_TRANSCRIPT_MAX_BYTES
  );
}

// 학생회비 납부 상태 배지 — 납부내역 카드와 홈 내 정보 목록(HomeInfoList)이 같이 쓴다
// Figma: 학생회비 납부 여부 뱃지 (nodeId 3147:146475)
export const FEE_STATUS_BADGES: Record<
  FeePaymentStatus,
  { label: string; color: "orange" | "red" | "green" }
> = {
  PAID: { color: "green", label: "납부완료" },
  PENDING: { color: "orange", label: "납부확인중" },
  REJECTED: { color: "red", label: "확인필요" },
};
