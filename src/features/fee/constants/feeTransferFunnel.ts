// 학생회비 계좌 송금(남은 학기 수 → 학점이수현황 캡처 → 토스 이동 → 송금 확인 → 확인요청 완료)
// 퍼널의 단계와 단계별 context 타입이다.
// Figma: 남은 학기 수(nodeId 3562:162833) / 학점이수현황 업로드(3562:162845) /
// 토스 이동 안내(3562:163025) / 송금 확인(3562:162973) / 확인요청 완료(3562:163013).
//
// 캡처 이미지는 `File`을 context에 그대로 담는다 — `File`은 구조화 복제가 되는 값이라
// history.state에 실려서, 토스 단계에서 뒤로 돌아와도 고른 파일이 남는다(별도 저장소 불필요).
// 다만 history.state는 브라우저마다 크기 상한이 있어서(Firefox 16MiB) 업로드 API가 붙으면
// 파일 대신 서버가 준 식별자를 담는 쪽으로 바꾸는 게 안전하다.
export type FeeTransferSteps = {
  semester: { semester?: number };
  transcript: { semester: number; transcript?: File };
  toss: { semester: number; transcript: File };
  confirm: { semester: number; transcript: File };
  complete: Record<never, never>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// 남은 학기 수로 받을 수 있는 값. 0학기는 납부할 이유가 없고, 상한은 실제 학적 기준이 없어
// 두 자리까지만 받는다 — 서버 검증 규칙이 정해지면 맞춘다.
export const SEMESTER_PATTERN = /^[1-9][0-9]?$/;

function isSemester(value: unknown): value is number {
  return typeof value === "number" && SEMESTER_PATTERN.test(String(value));
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
      data.transcript instanceof File,
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
      data.transcript instanceof File,
  },
  transcript: {
    guard: (data: unknown): data is FeeTransferSteps["transcript"] =>
      isRecord(data) &&
      isSemester(data.semester) &&
      (data.transcript === undefined || data.transcript instanceof File),
  },
};
