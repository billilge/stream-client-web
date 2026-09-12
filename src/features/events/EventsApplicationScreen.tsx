import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import {
  EVENTS_APPLICATION,
  EVENTS_OTHER_OPTION_LABEL,
  type EventsAnswer,
} from "@/features/events/constants/eventsApplication";

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

// Figma: 행사 신청하기 상세 (nodeId 1658:183386)
// 행사 정보·문항은 API 연동 전까지 라우트의 eventId와 무관하게 목업 하나를 보여준다.
// 제출 버튼 클릭 동작(신청 확인 모달)과 뒤로가기 시 작성 중단 모달은 다음 이슈 범위라 아직 없다.
function EventsApplicationScreen() {
  const [answers, setAnswers] = useState<Record<string, EventsAnswer>>({});
  const navigate = useNavigate();
  const { eventName, dateTime, location, illustration, questions } =
    EVENTS_APPLICATION;

  const canSubmit = questions.every(
    (question) => !question.isRequired || isAnswered(answers[question.id]),
  );

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
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
          <ActionAreaButton disabled={!canSubmit} sx={{ paddingBlock: "16px" }}>
            신청서 제출하기
          </ActionAreaButton>
        </ActionArea>
        {/* Figma Action Area(110px)는 버튼 아래가 iOS Home Bar 여백(Bottom Safe Area)까지 합쳐 34px인데,
            WDS ActionArea는 아래 padding 20px만 준다 — 모자란 14px을 여기서 더한다(BottomSheet와 같은 이유).
            Bottom Nav가 있는 화면은 BottomNav가 이 여백을 준다. */}
        <div className="h-[14px] bg-background-elevated-normal" />
      </div>
    </div>
  );
}

export default EventsApplicationScreen;
