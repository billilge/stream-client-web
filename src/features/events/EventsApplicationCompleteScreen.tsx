import { Navigate, useLocation, useNavigate } from "react-router-dom";

import CompleteCheck from "@/components/ui/CompleteCheck";
import ResultScreen from "@/components/ui/ResultScreen";
import EventsSummaryCard from "@/features/events/components/EventsSummaryCard";
import { EVENTS_TAB_PATHS } from "@/features/events/constants/events";
import type { EventsApplicationCompleteState } from "@/features/events/constants/eventsApplication";
import { HOME_PATH } from "@/features/home/constants/home";
import { formatDateTime } from "@/lib/date";

// Figma: 행사 신청 완료 페이지 (nodeId 1712:192283)
// 행사 정보는 신청 응답을 신청서 화면이 넘겨준 것으로 그린다.
function EventsApplicationCompleteScreen() {
  const navigate = useNavigate();
  const state = useLocation().state as EventsApplicationCompleteState | null;

  // 신청 직후에만 오는 화면이라, 주소로 바로 들어와 신청 결과가 없으면 홈으로 보낸다
  if (!state?.application) {
    return <Navigate replace to={HOME_PATH} />;
  }
  const { title, eventStartAt, place } = state.application;

  return (
    <ResultScreen
      description="신청해 주셔서 감사해요. 행사날 뵐게요!"
      illustration={<CompleteCheck />}
      illustrationGap={8}
      // 신청이 끝난 화면이라 닫으면 폼으로 돌아가지 않고 홈으로 나간다
      onClose={() => navigate(HOME_PATH)}
      primaryAction={{
        label: "홈으로 가기",
        onClick: () => navigate(HOME_PATH),
      }}
      secondaryAction={{
        label: "신청내역 보기",
        onClick: () => navigate(EVENTS_TAB_PATHS.application),
      }}
      title="신청이 완료됐어요"
    >
      <EventsSummaryCard
        dateTime={formatDateTime(eventStartAt)}
        eventName={title}
        location={place}
        tone="alternative"
      />
    </ResultScreen>
  );
}

export default EventsApplicationCompleteScreen;
