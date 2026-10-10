import { use } from "react";
import { Navigate } from "react-router-dom";

import { fetchMyEventApplication } from "@/entities/events/eventsApi";
import EventsApplicationSummary from "@/features/events/components/EventsApplicationSummary";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";

interface EventsApplicationDetailContentProps {
  applicationId: string;
}

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 상세 (1133:46216)
// 신청 당시 문항에 내가 낸 답변을 채워 읽기 전용으로 보여 준다. 취소된 신청은 입력들을 흐리게 한다.
function EventsApplicationDetailContent({
  applicationId,
}: EventsApplicationDetailContentProps) {
  const application = use(fetchMyEventApplication(applicationId));

  // 없는 신청내역이면 볼 내용이 없어서 신청내역 목록으로 돌려보낸다
  if (!application) {
    return <Navigate replace to={EVENTS_TAB_PATHS.application} />;
  }

  const isCancelled = application.status === "cancelled";

  return (
    <div className="flex flex-col gap-3 px-5 pb-6">
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
  );
}

export default EventsApplicationDetailContent;
