// 학생회비 계좌 송금(남은 학기 수 → 학점이수현황 캡처 → 토스 이동 → 송금 확인 → 확인요청 완료)
// 퍼널의 단계와 단계별 context 타입이다.
// Figma: 남은 학기 수(nodeId 3562:162833) / 학점이수현황 업로드(3562:162845) /
// 토스 이동 안내(3562:163025) / 송금 확인(3562:162973) / 확인요청 완료(3562:163013).
//
// 캡처 이미지는 `File`을 context에 그대로 담는다 — `File`은 구조화 복제가 되는 값이라
// history.state에 실려서, 토스 단계에서 뒤로 돌아와도 고른 파일이 남는다(별도 저장소 불필요).
// history.state는 브라우저마다 크기 상한이 있지만(Firefox 16MiB) 서버 업로드 상한(10MB)보다 커서 넘지 않는다.
//
// 캡처 단계에서 "다음"을 누르면 캡처를 서버에 올리고 토스 송금 링크를 받아 함께 싣는다.
// - `proofImageKey`: 올린 캡처의 파일 키 — 송금 확인에서 납부 요청에 넘긴다
// - `transferLinkUrl`: 서버가 링크를 주지 않으면(지금 낼 수 없는 상태) null이고, 토스 단계가 이동 실패 화면을 띄운다
export type FeeTransferSteps = {
  semester: { semester?: number };
  transcript: { semester: number; transcript?: File };
  toss: {
    semester: number;
    transcript: File;
    proofImageKey: string;
    transferLinkUrl: string | null;
  };
  confirm: { semester: number; transcript: File; proofImageKey: string };
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
// 첫 단계(남은 학기 수)로 돌려보낸다 — 학기 수나 캡처 없이 토스 이동 화면이 열리는 일이 없다.
// `File`은 history.state에서 되살아나지 못하는 경우가 있어 `instanceof`로 확인한다.
export const FEE_TRANSFER_STEP_OPTIONS = {
  complete: {
    guard: (data: unknown): data is FeeTransferSteps["complete"] =>
      isRecord(data),
  },
  confirm: {
    guard: (data: unknown): data is FeeTransferSteps["confirm"] =>
      isRecord(data) &&
      isSemester(data.semester) &&
      data.transcript instanceof File &&
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
      data.transcript instanceof File &&
      typeof data.proofImageKey === "string" &&
      isTransferLinkUrl(data.transferLinkUrl),
  },
  transcript: {
    guard: (data: unknown): data is FeeTransferSteps["transcript"] =>
      isRecord(data) &&
      isSemester(data.semester) &&
      (data.transcript === undefined || data.transcript instanceof File),
  },
};
