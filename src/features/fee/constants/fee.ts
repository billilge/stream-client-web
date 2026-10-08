// 학생회비 계좌 송금 플로우 경로. 화면설계서(687:20584)에는 경로 표기 컬럼이 아예 없어서
// 용어 사전(terminology.md)의 `회비 납부 → fee`와 "프론트 라우트 경로: /{코드 용어}" 규칙으로 정했다.
export const FEE_TRANSFER_PATHS = {
  complete: "/fee/transfer/complete",
  confirm: "/fee/transfer/confirm",
  semester: "/fee/transfer/semester",
  toss: "/fee/transfer/toss",
  transcript: "/fee/transfer/transcript",
} as const;

// 학점이수현황을 확인하는 국민대 K-스마트멘토 주소. 아직 못 받아서 비워 둔다 —
// 값이 있을 때만 열어서 빈 창이 뜨지 않게 한다.
export const FEE_K_SMART_MENTOR_URL = "";

// 업로드 받는 이미지 형식 — 학점이수현황 "캡처"라 스크린샷 확장자만 받는다
export const FEE_TRANSCRIPT_ACCEPT = "image/png,image/jpeg,image/webp";

// 남은 학기 수에 따라 금액이 달라지는 규칙을 아직 못 받았다. 연동 전까지 이 값으로 보낸다.
export const FEE_MOCK_AMOUNT = 10_000;

// 토스 송금 딥링크(`supertoss://send`)에 넣을 입금 계좌.
//
// 이 저장소는 public이라 계좌번호를 코드에 박지 않는다 — 한 번 커밋하면 지워도 히스토리·포크에
// 남는다. 테스트할 땐 저장소 루트에 `.env`(이미 .gitignore에 있다)를 만들어 채운다:
//
//   VITE_FEE_TOSS_BANK=국민
//   VITE_FEE_TOSS_ACCOUNT_NO=00000000000000
//
// 학생회 계좌가 확정되면 서버가 내려주도록 바꾸는 게 맞다(금액 규칙도 서버가 알아야 한다).
const TOSS_BANK = import.meta.env.VITE_FEE_TOSS_BANK ?? "";
const TOSS_ACCOUNT_NO = import.meta.env.VITE_FEE_TOSS_ACCOUNT_NO ?? "";

/** 계좌 정보가 없으면 빈 문자열을 돌려준다 — 호출하는 쪽이 이동 실패로 처리한다. */
export function buildTossTransferUrl(amount: number): string {
  if (!TOSS_BANK || !TOSS_ACCOUNT_NO) {
    return "";
  }
  const params = new URLSearchParams({
    accountNo: TOSS_ACCOUNT_NO,
    amount: String(amount),
    bank: TOSS_BANK,
  });

  return `supertoss://send?${params.toString()}`;
}
