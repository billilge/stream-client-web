import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import ConfirmModal from "@/components/ui/ConfirmModal";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsApplicationForm from "@/features/events/components/EventsApplicationForm";
import EventsApplicationSkeleton from "@/features/events/components/EventsApplicationSkeleton";
import { useBackNavigation } from "@/hooks/useBackNavigation";
import type { EventsAnswer } from "@/shared/entities/events/eventsTypes";

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
// 헤더와 작성 중단 확인만 맡고, 양식을 받아 그리고 제출하는 부분은 EventsApplicationForm이 맡는다.
// 헤더의 뒤로가기가 작성 중인지 알아야 해서 답변은 여기서 들고 있는다.
function EventsApplicationScreen() {
  const [answers, setAnswers] = useState<Record<string, EventsAnswer>>({});
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const { eventId = "" } = useParams<{ eventId: string }>();

  // 하나라도 고르거나 쓴 게 있으면 그냥 나갔을 때 잃는 내용이 있다는 뜻이라 확인부터 받는다
  const hasDraftAnswer = Object.values(answers).some(hasDraft);

  const goBack = useBackNavigation("/events");

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
      <Suspense fallback={<EventsApplicationSkeleton />}>
        <EventsApplicationForm
          answers={answers}
          eventId={eventId}
          onAnswerChange={(questionId, answer) =>
            setAnswers((prev) => ({ ...prev, [questionId]: answer }))
          }
        />
      </Suspense>

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
    </div>
  );
}

export default EventsApplicationScreen;
