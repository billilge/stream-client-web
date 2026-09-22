import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ScreenToast from "@/components/ui/ScreenToast";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";
import EventsSubmittingOverlay from "@/features/events/components/EventsSubmittingOverlay";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import {
  EVENTS_APPLICATION,
  EVENTS_OTHER_OPTION_LABEL,
  type EventsAnswer,
} from "@/features/events/constants/eventsApplication";
import { submitEventsApplication } from "@/features/events/constants/eventsApplicationSubmit";

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

// 나갈 때 잃을 내용이 있는지는 제출 가능 여부와 다르게 본다 — 기타를 고르기만 하고 입력을 안 했어도
// 고른 건 사라지기 때문에, isAnswered(제출 충족 여부)를 그대로 쓰면 경고 없이 날아간다.
function hasDraft(answer: EventsAnswer | undefined): boolean {
  if (answer === undefined) {
    return false;
  }
  if (typeof answer === "object") {
    return answer.selected.length > 0 || answer.otherText.trim().length > 0;
  }
  return answer.trim().length > 0;
}

// Figma: 행사 신청하기 상세 (nodeId 1658:183386), 신청 확인 모달 (1133:43407), 작성 중단 모달 (1133:43371)
// 행사 정보·문항은 API 연동 전까지 라우트의 eventId와 무관하게 목업 하나를 보여준다.
// 제출은 목업 함수로 동작한다 — 결과에 따라 완료·마감 화면으로 보내고, 실패하면 토스트를 띄운다.
function EventsApplicationScreen() {
  const [answers, setAnswers] = useState<Record<string, EventsAnswer>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFailureToastOpen, setIsFailureToastOpen] = useState(false);
  // 재시도해서 또 실패했을 때 떠 있던 토스트를 다시 띄우려고 센다 — 아래 ScreenToast의 key다
  const [failureCount, setFailureCount] = useState(0);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { eventName, dateTime, location, illustration, questions } =
    EVENTS_APPLICATION;

  const canSubmit = questions.every(
    (question) => !question.isRequired || isAnswered(answers[question.id]),
  );
  // 하나라도 고르거나 쓴 게 있으면 그냥 나갔을 때 잃는 내용이 있다는 뜻이라 확인부터 받는다
  const hasDraftAnswer = Object.values(answers).some(hasDraft);

  // 이 화면으로 바로 들어오면(딥링크·앱 WebView 진입) 뒤로 갈 히스토리가 없어서 navigate(-1)이
  // 아무 일도 하지 않는다 — 작성 중단 모달이 열린 채로 멈춰버린다. 그럴 땐 행사 목록으로 보낸다.
  // react-router가 히스토리 위치를 history.state.idx에 넣어두고, 직접 진입이면 0이다(실측 확인).
  const goBack = () => {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (historyIndex !== undefined && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate("/events", { replace: true });
  };

  const handleSubmit = async () => {
    setIsConfirmOpen(false);
    setIsSubmitting(true);
    const result = await submitEventsApplication();
    setIsSubmitting(false);

    if (result === "failure") {
      // 토스트가 이미 떠 있으면 open에 true를 다시 넣어도 아무 일도 일어나지 않고, 먼저 실패에서
      // 시작된 자동 닫힘 타이머가 그대로 흘러 곧 사라진다. key를 바꿔 새로 띄운다.
      setFailureCount((count) => count + 1);
      setIsFailureToastOpen(true);
      return;
    }
    // 제출이 끝난 폼으로는 돌아갈 수 없어야 해서 히스토리를 남기지 않고 바꿔치운다
    const resultPath = result === "closed" ? "closed" : "complete";
    navigate(`/events/${eventId}/apply/${resultPath}`, { replace: true });
  };

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => (hasDraftAnswer ? setIsLeaveOpen(true) : goBack())}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="신청서 작성"
      variant="normal"
    />,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 px-5 pb-8">
          <EventsSummaryCard
            dateTime={dateTime}
            eventName={eventName}
            illustration={illustration}
            location={location}
          />
          {questions.map((question) => (
            <EventsQuestionField
              answer={answers[question.id]}
              key={question.id}
              onAnswerChange={(answer) =>
                setAnswers((prev) => ({ ...prev, [question.id]: answer }))
              }
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
            앱 WebView에서는 네이티브 세이프에어리어와 중복이라 데스크톱 프레임에서만 남긴다(BottomNav와 같은 규칙). */}
        <div className="hidden h-[14px] bg-background-elevated-normal sm:block" />
      </div>

      <ConfirmModal
        cancelLabel="수정"
        confirmLabel="신청하기"
        description="신청 후에는 변경이 어려워요."
        highlight={eventName}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleSubmit}
        open={isConfirmOpen}
        title="행사를 신청할까요?"
      />

      <ConfirmModal
        cancelLabel="취소"
        confirmLabel="나가기"
        description="지금 나가면 작성한 내용이 사라져요."
        onCancel={() => setIsLeaveOpen(false)}
        onConfirm={goBack}
        open={isLeaveOpen}
        title="작성을 그만둘까요?"
        tone="negative"
      />

      <EventsSubmittingOverlay open={isSubmitting} />

      <ScreenToast
        key={failureCount}
        message="제출에 실패했어요. 다시 시도해 주세요."
        onOpenChange={setIsFailureToastOpen}
        open={isFailureToastOpen}
      />
    </div>
  );
}

export default EventsApplicationScreen;
