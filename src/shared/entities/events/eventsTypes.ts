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

// 신청서 질문 유형(QuestionType)
export type EventQuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE";

// 신청서 질문 — 양식 조회와 신청 상세가 같이 싣는 부분. 화면에는 eventsQuestions.ts에서 EventsQuestion으로 바꿔 넘긴다
export interface EventQuestionContent {
  questionId: number;
  questionText: string;
  questionType: EventQuestionType;
  isRequired: boolean;
  /** 신청서에서 몇 번째로 보일지(1부터) */
  displayOrder: number;
  /** 선택지. 텍스트형 질문은 빈 배열이다 */
  options: string[];
}

// 신청서 양식(GET /v1/app/events/{eventId}/form)
export interface EventForm {
  eventId: number;
  title: string;
  eventStartAt: string;
  place: string;
  questions: (EventQuestionContent & {
    /** 답변 길이 제한. 선택형 질문은 null */
    maxLength: number | null;
  })[];
}

// 신청서 답변 한 건. 텍스트형은 answerText, 선택형은 고른 선택지의 순서 번호(0부터)를 selectedOptions로 보낸다
export interface EventApplyAnswer {
  questionId: number;
  answerText?: string;
  selectedOptions?: number[];
}

// 행사 신청 결과(POST /v1/app/events/{eventId}/applications) — 완료 화면이 행사 요약을 그린다
export interface EventApplyResult {
  applicationId: number;
  title: string;
  eventStartAt: string;
  place: string;
}

// 신청 상태(EventApplicationStatus). 취소해도 기록은 남고 상태만 CANCELED가 된다
export type EventApplicationStatus = "APPLIED" | "CANCELED";

// 내 신청내역 한 건(GET /v1/app/events/applications)
export interface MyEventApplicationListItem {
  applicationId: number;
  eventId: number;
  title: string;
  thumbnailUrl: string | null;
  applicationStatus: EventApplicationStatus;
  appliedAt: string;
  /** 취소한 신청만 있다 */
  canceledAt: string | null;
}

// 신청서 질문 한 건과 그 신청에서 제출한 답변
export interface EventAnsweredQuestion extends EventQuestionContent {
  /** 텍스트형 답변. 답하지 않은 선택 질문은 null */
  answerText: string | null;
  /** 고른 선택지의 순서 번호(0부터). 답하지 않은 선택 질문은 빈 배열 */
  selectedOptions: number[];
}

// 내 신청 상세(GET /v1/app/events/applications/{applicationId}) — 행사 질문 전체에 이 신청의 답변을 붙여 준다
export interface MyEventApplicationDetail {
  eventId: number;
  title: string;
  place: string;
  applicationStatus: EventApplicationStatus;
  eventStartAt: string;
  appliedAt: string;
  /** 취소한 신청만 있다 */
  canceledAt: string | null;
  questions: EventAnsweredQuestion[];
}

// 화면(EventsQuestionField)이 그리는 문항·답변 — 신청 폼과 신청내역 상세가 같이 쓴다.
// 서버 질문(EventQuestionContent)은 eventsQuestions.ts에서 이 모양으로 바꾼다.
interface EventsQuestionBase {
  id: string;
  title: string;
  isRequired: boolean;
}

export interface EventsChoiceQuestion extends EventsQuestionBase {
  type: "multipleChoice" | "singleChoice";
  options: string[];
  // 기타(직접 입력) 선택지를 마지막에 붙일지 — 디자인상 복수 선택에만 있다.
  // 서버는 아직 기타 선택지를 내려주지 않는다(기타 선택지가 있는 행사는 공개를 막아 뒀다)
  hasOtherOption?: boolean;
}

export interface EventsTextQuestion extends EventsQuestionBase {
  type: "shortAnswer" | "longAnswer";
}

export type EventsQuestion = EventsChoiceQuestion | EventsTextQuestion;

// 복수 선택은 고른 선택지 목록과 기타 입력 내용을 함께 들고 있는다.
// 단일 선택·텍스트형은 문자열 하나.
export interface EventsChoiceAnswer {
  selected: string[];
  otherText: string;
}

export type EventsAnswer = string | EventsChoiceAnswer;
