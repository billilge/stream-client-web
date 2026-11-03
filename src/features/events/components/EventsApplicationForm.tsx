import { useSuspenseQuery } from "@tanstack/react-query";
import { ActionArea, ActionAreaButton } from "@wanteddev/wds";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenToast from "@/components/ui/ScreenToast";
import SubmittingOverlay from "@/components/ui/SubmittingOverlay";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import {
  EVENTS_APPLICATION_ILLUSTRATION,
  EVENTS_OTHER_OPTION_LABEL,
  type EventsApplicationCompleteState,
} from "@/features/events/constants/eventsApplication";
import { formatDateTime } from "@/lib/date";
import { isApiError } from "@/shared/api";
import {
  EVENTS_CLOSED_ERROR_CODES,
  EVENTS_ERROR_CODES,
  eventsQueries,
  useApplyEventMutation,
} from "@/shared/entities/events/eventsQueries";
import {
  toEventApplyAnswers,
  toEventsQuestions,
} from "@/shared/entities/events/eventsQuestions";
import type { EventsAnswer } from "@/shared/entities/events/eventsTypes";

const SUBMIT_FAILURE_MESSAGES = {
  alreadyApplied: "이미 신청한 행사예요.",
  failed: "제출에 실패했어요. 다시 시도해 주세요.",
} as const;

type SubmitFailureMessage =
  (typeof SUBMIT_FAILURE_MESSAGES)[keyof typeof SUBMIT_FAILURE_MESSAGES];

// 복수 선택은 하나라도 골라야 하고, 기타를 골랐으면 입력 내용까지 있어야 충족으로 본다
function isAnswered(answer: EventsAnswer | undefined): boolean {
  if (typeof answer === "object") {
    if (answer.selected.length === 0) {
      return false;
    }
    return (
      !answer.selected.includes(EVENTS_OTHER_OPTION_LABEL) ||
      answer.otherText.trim().length > 0
    );
  }
  return (answer ?? "").trim().length > 0;
}

interface EventsApplicationFormProps {
  eventId: string;
  /** 나갈 때 작성 중단을 물으려고 화면이 답변을 들고 있다 */
  answers: Record<string, EventsAnswer>;
  onAnswerChange: (questionId: string, answer: EventsAnswer) => void;
}

// 신청서 양식을 받아 그리고 제출하는 부분. 양식을 받는 동안은 EventsApplicationScreen의 Suspense가
// EventsApplicationSkeleton을 보여준다. 제출 결과에 따라 완료·마감 화면으로 보내고, 실패하면 토스트를 띄운다.
function EventsApplicationForm({
  eventId,
  answers,
  onAnswerChange,
}: EventsApplicationFormProps) {
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [failureMessage, setFailureMessage] = useState<SubmitFailureMessage>(
    SUBMIT_FAILURE_MESSAGES.failed,
  );
  const [isFailureToastOpen, setIsFailureToastOpen] = useState(false);
  // 재시도해서 또 실패했을 때 떠 있던 토스트를 다시 띄우려고 센다 — 아래 ScreenToast의 key다
  const [failureCount, setFailureCount] = useState(0);
  const { data: form } = useSuspenseQuery({
    ...eventsQueries.form(eventId),
    select: (data) =>
      data && { ...data, questions: toEventsQuestions(data.questions) },
  });
  const { mutate: apply, isPending: isSubmitting } =
    useApplyEventMutation(eventId);

  const closedPath = `/events/${eventId}/apply/closed`;

  // 상세에서 들어오는 사이에 마감됐으면 쓸 수 없는 신청서라 마감 화면으로 바꿔치운다
  if (!form) {
    return <Navigate replace to={closedPath} />;
  }

  const canSubmit = form.questions.every(
    (question) => !question.isRequired || isAnswered(answers[question.id]),
  );

  const showFailure = (message: SubmitFailureMessage) => {
    setFailureMessage(message);
    // 토스트가 이미 떠 있으면 open에 true를 다시 넣어도 아무 일도 일어나지 않고, 먼저 실패에서
    // 시작된 자동 닫힘 타이머가 그대로 흘러 곧 사라진다. key를 바꿔 새로 띄운다.
    setFailureCount((count) => count + 1);
    setIsFailureToastOpen(true);
  };

  // mutate에 넘긴 콜백은 제출 중에 화면을 떠나면 불리지 않아서, 늦게 온 응답이 결과 화면으로 끌고 가지 않는다
  const handleSubmit = () => {
    setIsConfirmOpen(false);
    apply(toEventApplyAnswers(form.questions, answers), {
      onSuccess: (application) =>
        // 제출이 끝난 폼으로는 돌아갈 수 없어야 해서 히스토리를 남기지 않고 바꿔치운다
        navigate(`/events/${eventId}/apply/complete`, {
          replace: true,
          state: { application } satisfies EventsApplicationCompleteState,
          viewTransition: true,
        }),
      onError: (error) => {
        if (
          isApiError(error) &&
          EVENTS_CLOSED_ERROR_CODES.includes(error.code)
        ) {
          navigate(closedPath, { replace: true, viewTransition: true });
          return;
        }
        if (
          isApiError(error) &&
          error.code === EVENTS_ERROR_CODES.alreadyApplied
        ) {
          showFailure(SUBMIT_FAILURE_MESSAGES.alreadyApplied);
          return;
        }
        console.error(error);
        showFailure(SUBMIT_FAILURE_MESSAGES.failed);
      },
    });
  };

  return (
    <>
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-2 px-5 pb-8">
          <EventsSummaryCard
            dateTime={formatDateTime(form.eventStartAt)}
            eventName={form.title}
            illustration={EVENTS_APPLICATION_ILLUSTRATION}
            location={form.place}
          />
          {form.questions.map((question) => (
            <EventsQuestionField
              answer={answers[question.id]}
              key={question.id}
              onAnswerChange={(answer) => onAnswerChange(question.id, answer)}
              question={question}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0">
        {/* background: 버튼 위로 스크롤 내용이 자연스럽게 사라지는 그라데이션(Figma Gradient/Solid) */}
        <ActionArea background>
          {/* WDS ActionAreaButton은 항상 Button size="large"(padding 12px 28px → 48px)로 그리는데,
              Figma Main Action은 padding 16px 28px(56px)이라 세로 padding만 sx로 맞춘다. */}
          <ActionAreaButton
            disabled={!canSubmit}
            onClick={() => setIsConfirmOpen(true)}
            sx={{ paddingBlock: "16px" }}
          >
            신청서 제출하기
          </ActionAreaButton>
        </ActionArea>
        {/* Figma Action Area(110px)는 버튼 아래가 iOS Home Bar 여백(Bottom Safe Area)까지 합쳐 34px인데,
            WDS ActionArea는 아래 padding 20px만 준다 — 모자란 14px을 여기서 더한다(BottomSheet와 같은 이유).
            Bottom Nav가 있는 화면은 BottomNav가 이 여백을 준다.
            앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 컬럼에서만 남긴다(BottomNav와 같은 규칙). */}
        <div className="h-safe-bottom-extra bg-background-elevated-normal sm:h-[14px]" />
      </div>

      <ConfirmModal
        cancelLabel="수정"
        confirmLabel="신청하기"
        description="신청 후에는 변경이 어려워요."
        highlight={form.title}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleSubmit}
        open={isConfirmOpen}
        title="행사를 신청할까요?"
      />

      <SubmittingOverlay
        description="곧 완료돼요! 잠시만 기다려 주세요"
        open={isSubmitting}
        title="신청서를 제출하고 있어요"
      />

      <ScreenToast
        key={failureCount}
        message={failureMessage}
        onOpenChange={setIsFailureToastOpen}
        open={isFailureToastOpen}
      />
    </>
  );
}

export default EventsApplicationForm;
