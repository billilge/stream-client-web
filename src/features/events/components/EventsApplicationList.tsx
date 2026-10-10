import { Divider } from "@wanteddev/wds";
import { Fragment, use } from "react";

import { fetchMyEventApplications } from "@/entities/events/eventsApi";
import EventsApplicationCard from "@/features/events/components/EventsApplicationCard";
import EventsEmptyState from "@/features/events/components/EventsEmptyState";

interface EventsApplicationListProps {
  onSelectEvent: (eventId: string) => void;
  onSelectApplication: (applicationId: string) => void;
  onBrowseEvents: () => void;
}

// Figma: 행사/신청내역 (nodeId 1133:46168), 빈 상태 (1165:63551)
// 카드 사이는 행사 목록과 같은 간격(24)과 구분선이다.
function EventsApplicationList({
  onSelectEvent,
  onSelectApplication,
  onBrowseEvents,
}: EventsApplicationListProps) {
  const applications = use(fetchMyEventApplications());

  if (applications.length === 0) {
    return (
      // Figma는 가운데가 아니라 토글 아래 176px에 둔다(1165:63551, Empty State y=318)
      <div className="flex justify-center pt-44">
        <EventsEmptyState
          actionLabel="행사 둘러보기"
          description="관심 있는 행사를 신청해 보세요"
          descriptionWeight="regular"
          onAction={onBrowseEvents}
          title="아직 신청한 행사가 없어요"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pt-6 pb-4">
      {applications.map((application, index) => (
        <Fragment key={application.id}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <EventsApplicationCard
            application={application}
            onSelectApplication={() => onSelectApplication(application.id)}
            onSelectEvent={() => onSelectEvent(application.eventId)}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default EventsApplicationList;
