import { Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EventsDetailContent from "@/features/events/components/EventsDetailContent";
import EventsDetailSkeleton from "@/features/events/components/EventsDetailSkeleton";

// 행사 상세 화면 — 이동 같은 화면 동작만 정하고, 행사 데이터를 받는 동안은 상세 배치를 따른
// 스켈레톤을 보여준다. 헤더가 없는 화면이라(EventsDetailContent 주석 참고) 화면 전체가 데이터 영역이다.
function EventsDetailScreen() {
  const navigate = useNavigate();
  const { eventId = "" } = useParams<{ eventId: string }>();

  return (
    <Suspense fallback={<EventsDetailSkeleton />}>
      <EventsDetailContent
        eventId={eventId}
        onApply={(id) =>
          navigate(`/events/${id}/apply`, { viewTransition: true })
        }
        onBack={() => navigate(-1)}
      />
    </Suspense>
  );
}

export default EventsDetailScreen;
