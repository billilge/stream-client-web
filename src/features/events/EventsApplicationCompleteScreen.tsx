import { useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import { EVENTS_APPLICATION } from "@/features/events/constants/eventsApplication";

// Figma: 행사 신청 완료 페이지 (nodeId 1712:192283)
// 행사 정보는 신청 폼과 마찬가지로 API 연동 전까지 목업 하나를 보여준다.
function EventsApplicationCompleteScreen() {
  const navigate = useNavigate();
  const { eventName, dateTime, location } = EVENTS_APPLICATION;

  return (
    <ResultScreen
      description="신청해 주셔서 감사해요. 행사날 뵐게요!"
      illustration={<CompleteCheck />}
      illustrationGap={8}
      // 신청이 끝난 화면이라 닫으면 폼으로 돌아가지 않고 홈으로 나간다
      onClose={() => navigate("/")}
      primaryAction={{ label: "홈으로 가기", onClick: () => navigate("/") }}
      secondaryAction={{
        label: "신청내역 보기",
        onClick: () => navigate(EVENTS_TAB_PATHS.application),
      }}
      title="신청이 완료됐어요"
    >
      <EventsSummaryCard
        dateTime={dateTime}
        eventName={eventName}
        location={location}
        tone="alternative"
      />
    </ResultScreen>
  );
}

export default EventsApplicationCompleteScreen;
