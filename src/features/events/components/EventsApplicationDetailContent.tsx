import { Button } from "@wanteddev/wds";
import { use } from "react";
import { Navigate } from "react-router-dom";

import { fetchMyEventApplication } from "@/entities/events/eventsApi";
import EventsApplicationSummary from "@/features/events/components/EventsApplicationSummary";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";

interface EventsApplicationDetailContentProps {
  applicationId: string;
  /** 신청 취소 요청 중에는 버튼을 막아 두 번 보내지 않게 한다 */
  isCancelling: boolean;
  onCancel: () => void;
}

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 상세 (1133:46216)
// 신청 당시 문항에 내가 낸 답변을 채워 읽기 전용으로 보여 준다. 취소된 신청은 입력들을 흐리게 한다.
function EventsApplicationDetailContent({
  applicationId,
  isCancelling,
  onCancel,
}: EventsApplicationDetailContentProps) {
  const application = use(fetchMyEventApplication(applicationId));

  // 없는 신청내역이면 볼 내용이 없어서 신청내역 목록으로 돌려보낸다
  if (!application) {
    return <Navigate replace to={EVENTS_TAB_PATHS.application} />;
  }

  const isCancelled = application.status === "cancelled";

  return (
    <div className="flex flex-col items-center gap-6 pb-6">
      <div className="flex w-full flex-col gap-3 px-5">
        <EventsApplicationSummary application={application} />
        {application.questions.map((question) => (
          <EventsQuestionField
            answer={application.answers[question.id]}
            disabled={isCancelled}
            key={question.id}
            question={question}
          />
        ))}
      </div>
      {/* Figma 신청취소 상세(1133:46216)에는 버튼이 없다 — 신청완료일 때만 보인다.
          WDS Button 색은 primary/assistive뿐이라 outlined primary(SemiBold 글자)에 글자·테두리 색만
          Status/Negative로 덮는다(ConfirmModal의 위험 버튼과 같은 방식). */}
      {!isCancelled && (
        <Button
          color="primary"
          disabled={isCancelling}
          onClick={onCancel}
          size="medium"
          sx={{
            boxShadow: "inset 0 0 0 1px var(--color-status-negative)",
            color: "var(--color-status-negative)",
          }}
          variant="outlined"
        >
          신청 취소
        </Button>
      )}
    </div>
  );
}

export default EventsApplicationDetailContent;
