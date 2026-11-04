import type { z } from "zod";

import type {
  EVENT_APPLICATION_STATUSES,
  EVENT_QUESTION_TYPES,
  EVENT_RECRUIT_STATUSES,
  EVENT_RECRUIT_TYPES,
  eventAnsweredQuestionSchema,
  eventApplyResultSchema,
  eventDetailSchema,
  eventFormSchema,
  eventListItemSchema,
  eventQuestionContentSchema,
  myEventApplicationDetailSchema,
  myEventApplicationListItemSchema,
} from "@/shared/entities/events/eventsQueries";

// stream-server 학생 앱 행사 API(AppEventController) 응답 모양 그대로다 — eventsQueries.ts의 응답 검사 스키마에서 만든다.
// 화면 모양은 화면 쪽에서 바꾼다.

// 모집 상태(RecruitStatus). 서버가 조회 시점 기준으로 계산하고, 정원이 다 차도 CLOSED다
export type EventRecruitStatus = (typeof EVENT_RECRUIT_STATUSES)[number];

// 모집 방식(RecruitType). 정원은 선착순(FIRST_COME)일 때만 있다
export type EventRecruitType = (typeof EVENT_RECRUIT_TYPES)[number];

// 행사 목록 한 건(GET /v1/app/events)
export type EventListItem = z.infer<typeof eventListItemSchema>;

// 행사 상세(GET /v1/app/events/{eventId})
export type EventDetail = z.infer<typeof eventDetailSchema>;

// 신청서 질문 유형(QuestionType)
export type EventQuestionType = (typeof EVENT_QUESTION_TYPES)[number];

// 신청서 질문 — 양식 조회와 신청 상세가 같이 싣는 부분
export type EventQuestionContent = z.infer<typeof eventQuestionContentSchema>;

// 신청서 양식(GET /v1/app/events/{eventId}/form)
export type EventForm = z.infer<typeof eventFormSchema>;

// 신청서 답변 한 건. 텍스트형은 answerText, 선택형은 고른 선택지의 순서 번호(0부터)를 selectedOptions로 보낸다
export interface EventApplyAnswer {
  questionId: number;
  answerText?: string;
  selectedOptions?: number[];
}

// 행사 신청 결과(POST /v1/app/events/{eventId}/applications)
export type EventApplyResult = z.infer<typeof eventApplyResultSchema>;

// 신청 상태(EventApplicationStatus). 취소해도 기록은 남고 상태만 CANCELED가 된다
export type EventApplicationStatus =
  (typeof EVENT_APPLICATION_STATUSES)[number];

// 내 신청내역 한 건(GET /v1/app/events/applications)
export type MyEventApplicationListItem = z.infer<
  typeof myEventApplicationListItemSchema
>;

// 신청서 질문 한 건과 그 신청에서 제출한 답변
export type EventAnsweredQuestion = z.infer<typeof eventAnsweredQuestionSchema>;

// 내 신청 상세(GET /v1/app/events/applications/{applicationId})
export type MyEventApplicationDetail = z.infer<
  typeof myEventApplicationDetailSchema
>;

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
