export type EventStatus = "open" | "upcoming" | "closed";

export interface EventItem {
  id: string;
  title: string;
  eventDate: string;
  status: EventStatus;
  statusLabel: string;
  actionLabel: string;
  /** 상세 상단 Hero 이미지 개수 — 실 이미지 API 전까지 PageCounter 표기용 */
  imageCount: number;
  /** 상세 메타데이터 "일시" */
  schedule: string;
  /** 상세 메타데이터 "장소" */
  location: string;
  /** 상세 메타데이터 "대상" — Figma가 두 줄로 쪼개 보여줘서 줄 단위로 들고 있는다 */
  audience: string[];
  /** 상세 본문. 줄바꿈을 그대로 살려 렌더링한다 */
  description: string;
}

// 행사 신청 문항·답변 — 신청 폼과 신청내역 상세가 같이 쓴다.
interface EventsQuestionBase {
  id: string;
  title: string;
  isRequired: boolean;
}

export interface EventsChoiceQuestion extends EventsQuestionBase {
  type: "multipleChoice" | "singleChoice";
  options: string[];
  // 기타(직접 입력) 선택지를 마지막에 붙일지 — 디자인상 복수 선택에만 있다
  hasOtherOption?: boolean;
}

export interface EventsTextQuestion extends EventsQuestionBase {
  type: "shortAnswer" | "longAnswer";
}

// type 값 이름은 임시 — 백엔드 스펙이 나오면 거기에 맞춘다
export type EventsQuestion = EventsChoiceQuestion | EventsTextQuestion;

// 복수 선택은 고른 선택지 목록과 기타 입력 내용을 함께 들고 있는다.
// 단일 선택·텍스트형은 문자열 하나.
export interface EventsChoiceAnswer {
  selected: string[];
  otherText: string;
}

export type EventsAnswer = string | EventsChoiceAnswer;

export type MyEventApplicationStatus = "applied" | "cancelled";

interface MyEventApplicationBase {
  id: string;
  eventId: string;
  eventTitle: string;
  // "2026-05-12T12:00"
  eventDateTime: string;
  location: string;
  appliedAt: string;
  questions: EventsQuestion[];
  // 문항 id → 답변. 답하지 않은 선택 문항은 빠진다
  answers: Record<string, EventsAnswer>;
}

// 내 행사 신청내역. 행사 쪽 문항이 나중에 바뀌어도 내가 답한 그대로 보여 주려고 신청 당시 문항을 같이 들고 있다.
// 취소 일시는 신청취소일 때만 있다 — 상태로 갈라 두어 "취소인데 취소 일시가 없는" 경우를 타입에서 막는다.
export type MyEventApplication = MyEventApplicationBase &
  (
    | { status: "applied"; cancelledAt: null }
    | { status: "cancelled"; cancelledAt: string }
  );
