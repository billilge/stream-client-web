import { Button } from "@wanteddev/wds";
import { use } from "react";
import { Navigate } from "react-router-dom";

import { NEGATIVE_BUTTON_SX } from "@/components/ui/negativeButtonSx";
import { fetchMyEventApplication } from "@/entities/events/eventsApi";
import EventsApplicationSummary from "@/features/events/components/EventsApplicationSummary";
import EventsQuestionField from "@/features/events/components/EventsQuestionField";

interface EventsApplicationDetailContentProps {
  applicationId: string;
  /** 없는 신청내역일 때 돌려보낼 곳 */
  fallbackPath: string;
  /** 신청 취소 요청 중에는 버튼을 막아 두 번 보내지 않게 한다 */
  isCancelling: boolean;
  onCancel: () => void;
}

// Figma: 신청내역 상세 (nodeId 1133:46181), 신청취소 상세 (1133:46216)
// 신청 당시 문항에 내가 낸 답변을 채워 읽기 전용으로 보여 준다. 취소된 신청은 입력들을 흐리게 한다.
function EventsApplicationDetailContent({
  applicationId,
  fallbackPath,
  isCancelling,
  onCancel,
}: EventsApplicationDetailContentProps) {
  const application = use(fetchMyEventApplication(applicationId));

  // 없는 신청내역이면 볼 내용이 없어서 화면이 정한 곳(신청내역 목록)으로 돌려보낸다
  if (!application) {
    return <Navigate replace to={fallbackPath} />;
  }

  const isCancelled = application.status === "cancelled";

  return (
    <div className="flex flex-col items-center gap-6 pb-6">
      <div className="flex w-full flex-col gap-2 px-5">
        <EventsApplicationSummary application={application} />
        {application.questions.map((question) => (
          <EventsQuestionField
            answer={application.answers[question.id]}
            disabled={isCancelled}
            key={question.id}
            question={question}
            readOnly
          />
        ))}
      </div>
      {/* Figma 신청취소 상세(1133:46216)에는 버튼이 없다 — 신청완료일 때만 보인다.
          outlined primary(SemiBold 글자)에 빨간 글자·테두리를 덮는다(NEGATIVE_BUTTON_SX). */}
      {!isCancelled && (
        <Button
          color="primary"
          disabled={isCancelling}
          onClick={onCancel}
          size="medium"
          sx={NEGATIVE_BUTTON_SX.outlined}
          variant="outlined"
        >
          신청 취소
        </Button>
      )}
    </div>
  );
}

export default EventsApplicationDetailContent;
