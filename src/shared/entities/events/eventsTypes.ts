// stream-server 학생 앱 행사 API(AppEventController) 응답 모양이다.
// 일시는 서버 LocalDateTime 문자열("2026-06-04T18:30:00", 소수 초가 붙을 수 있다)이다.

// 모집 상태(RecruitStatus). 서버가 조회 시점 기준으로 계산하고, 정원이 다 차도 CLOSED다
export type EventRecruitStatus = "BEFORE_OPEN" | "OPEN" | "CLOSED";

// 모집 방식(RecruitType). 정원은 선착순(FIRST_COME)일 때만 있다
export type EventRecruitType = "FIRST_COME" | "OPEN";

// 행사 목록 한 건(GET /v1/app/events)
export interface EventListItem {
  eventId: number;
  title: string;
  eventStartAt: string;
  thumbnailUrl: string | null;
  applyStartAt: string;
  applyEndAt: string;
  recruitStatus: EventRecruitStatus;
  /** 신청 마감일까지 남은 날 수(0이면 오늘 마감). 모집중일 때만 있다 */
  daysUntilDeadline: number | null;
}

// 행사 상세(GET /v1/app/events/{eventId})
export interface EventDetail {
  eventId: number;
  title: string;
  /** 본문. 줄바꿈을 그대로 살려 렌더링한다 */
  description: string;
  place: string;
  eventStartAt: string;
  eventEndAt: string;
  applyStartAt: string;
  applyEndAt: string;
  recruitStatus: EventRecruitStatus;
  daysUntilDeadline: number | null;
  images: { fileId: number; fileUrl: string }[];
  // 신청 조건 — stream-server#190에서 응답에 더해지는 값이라 그전에는 없다. 없으면 납부자 전용이 아니고
  // 정원 없이 모집하는 것으로 본다. 상세 "대상" 문구는 서버가 만들지 않고 이 값들로 프론트가 조합한다.
  feePaidOnly?: boolean;
  recruitType?: EventRecruitType;
  /** 선착순일 때만 있다 */
  capacity?: number | null;
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
