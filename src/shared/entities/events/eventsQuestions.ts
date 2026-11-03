import type {
  EventAnsweredQuestion,
  EventApplyAnswer,
  EventQuestionContent,
  EventQuestionType,
  EventsAnswer,
  EventsQuestion,
} from "@/shared/entities/events/eventsTypes";

// 신청서 질문을 서버 모양과 화면(EventsQuestionField) 모양 사이에서 바꾼다 — 신청 폼과 신청내역 상세가 같이 쓴다.
// 화면은 선택지를 문구로 들고 있고, 서버는 선택지 순서 번호(0부터)로 주고받는다.

const QUESTION_TYPES = {
  LONG_TEXT: "longAnswer",
  MULTIPLE_CHOICE: "multipleChoice",
  SHORT_TEXT: "shortAnswer",
  SINGLE_CHOICE: "singleChoice",
} as const satisfies Record<EventQuestionType, EventsQuestion["type"]>;

// 서버가 준 순서(displayOrder)대로 화면 문항으로 바꾼다
export function toEventsQuestions(
  questions: EventQuestionContent[],
): EventsQuestion[] {
  return [...questions]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((question) => {
      const base = {
        id: String(question.questionId),
        isRequired: question.isRequired,
        title: question.questionText,
      };
      const type = QUESTION_TYPES[question.questionType];
      return type === "multipleChoice" || type === "singleChoice"
        ? { ...base, options: question.options, type }
        : { ...base, type };
    });
}

// 신청 상세의 답변을 질문 id → 화면 답변으로 바꾼다. 답하지 않은 질문은 빠진다.
export function toEventsAnswers(
  questions: EventAnsweredQuestion[],
): Record<string, EventsAnswer> {
  return Object.fromEntries(
    questions.flatMap((question): [string, EventsAnswer][] => {
      const id = String(question.questionId);
      // 선택지가 바뀌어 범위를 벗어난 번호는 건너뛴다(서버가 선택지 문구를 찾을 때와 같은 기준)
      const selected = question.selectedOptions
        .filter((index) => index >= 0 && index < question.options.length)
        .map((index) => question.options[index]);

      switch (question.questionType) {
        case "MULTIPLE_CHOICE":
          return selected.length > 0 ? [[id, { otherText: "", selected }]] : [];
        case "SINGLE_CHOICE":
          return selected.length > 0 ? [[id, selected[0]]] : [];
        default:
          return question.answerText ? [[id, question.answerText]] : [];
      }
    }),
  );
}

// 화면 답변을 신청 요청 모양으로 바꾼다. 답하지 않은 질문은 뺀다 — 서버는 선택 질문의 생략을 빈 답변과 같게 본다.
export function toEventApplyAnswers(
  questions: EventsQuestion[],
  answers: Record<string, EventsAnswer>,
): EventApplyAnswer[] {
  return questions.flatMap((question): EventApplyAnswer[] => {
    const answer = answers[question.id];
    const questionId = Number(question.id);

    if (
      question.type === "multipleChoice" ||
      question.type === "singleChoice"
    ) {
      const selected =
        typeof answer === "object" ? answer.selected : answer ? [answer] : [];
      // 서버 선택지에 없는 문구(기타)는 순서 번호가 없어서 빠진다
      const selectedOptions = selected
        .map((option) => question.options.indexOf(option))
        .filter((index) => index >= 0);
      return selectedOptions.length > 0
        ? [{ questionId, selectedOptions }]
        : [];
    }

    const answerText = typeof answer === "string" ? answer.trim() : "";
    return answerText ? [{ answerText, questionId }] : [];
  });
}
