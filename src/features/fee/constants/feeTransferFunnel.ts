// 학생회비 계좌 송금(남은 학기 수 → 학점이수현황 캡처 → 토스 이동 → 송금 확인 → 확인요청 완료)
// 퍼널의 단계와 단계별 context 타입이다.
// Figma: 남은 학기 수(nodeId 3562:162833) / 학점이수현황 업로드(3562:162845) /
// 토스 이동 안내(3562:163025) / 송금 확인(3562:162973) / 확인요청 완료(3562:163013).
//
// context는 history.state에 실려서 문자열·숫자만 담는다. 캡처 이미지(`File`)는 담지 않는다 —
// Chromium(Android WebView 포함)은 `File`이 든 history.state를 뒤로가기로 되살리지 못하고 state를
// 통째로 null로 돌려줘서, 토스 단계에서 뒤로 가면 퍼널이 첫 단계로 초기화됐다. 고른 파일은 퍼널 화면
// (FeeTransferScreen)이 메모리에 들고 있는다.
//
// 캡처 단계에서 "다음"을 누르면 캡처를 서버에 올리고 토스 송금 링크를 받아 함께 싣는다.
// - `proofImageKey`: 올린 캡처의 파일 키 — 송금 확인에서 납부 요청에 넘긴다
// - `transferLinkUrl`: 서버가 링크를 주지 않으면(지금 낼 수 없는 상태) null이고, 토스 단계가 이동 실패 화면을 띄운다
export type FeeTransferSteps = {
  semester: { semester?: number };
  transcript: { semester: number };
  toss: {
    semester: number;
    proofImageKey: string;
    transferLinkUrl: string | null;
  };
  confirm: { semester: number; proofImageKey: string };
  complete: Record<never, never>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// 남은 학기 수로 받을 수 있는 값 — 서버 회비 정책(RemainingSemesters)과 같은 1~8이다.
export const SEMESTER_PATTERN = /^[1-8]$/;

function isSemester(value: unknown): value is number {
  return typeof value === "number" && SEMESTER_PATTERN.test(String(value));
}

function isTransferLinkUrl(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

// 새로고침이나 주소 직접 입력처럼 앞 단계의 값이 없는 채로 중간 단계에 들어오면 guard가 걸러서
// 첫 단계(남은 학기 수)로 돌려보낸다 — 학기 수나 올린 캡처 없이 토스 이동 화면이 열리는 일이 없다.
export const FEE_TRANSFER_STEP_OPTIONS = {
  complete: {
    guard: (data: unknown): data is FeeTransferSteps["complete"] =>
      isRecord(data),
  },
  confirm: {
    guard: (data: unknown): data is FeeTransferSteps["confirm"] =>
      isRecord(data) &&
      isSemester(data.semester) &&
      typeof data.proofImageKey === "string",
  },
  semester: {
    guard: (data: unknown): data is FeeTransferSteps["semester"] =>
      isRecord(data) &&
      (data.semester === undefined || isSemester(data.semester)),
  },
  toss: {
    guard: (data: unknown): data is FeeTransferSteps["toss"] =>
      isRecord(data) &&
      isSemester(data.semester) &&
      typeof data.proofImageKey === "string" &&
      isTransferLinkUrl(data.transferLinkUrl),
  },
  transcript: {
    guard: (data: unknown): data is FeeTransferSteps["transcript"] =>
      isRecord(data) && isSemester(data.semester),
  },
};
