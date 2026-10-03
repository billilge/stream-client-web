import { Divider } from "@wanteddev/wds";
import { Fragment, use } from "react";

import { fetchEvents } from "@/entities/events/eventsApi";
import EventsCard from "@/features/events/components/EventsCard";
import EventsEmptyState from "@/features/events/components/EventsEmptyState";

// Figma: 행사 모집중 empty (nodeId 1165:62713)는 "모집중" 필터 버전만 준다 —
// 일러스트·레이아웃·"아카이빙 둘러보기" 버튼이 이 조합의 스펙이다.
// 나머지 필터 문구는 디자인에 없어서 같은 톤으로 맞춰 쓴 것이고, 확정 문구가 나오면 교체한다.
// 버튼은 Figma가 지정한 모집중에만 노출한다 — 모집종료 필터에서 "지난 행사를 보세요"는 모순이 된다.
const EMPTY_STATE_BY_FILTER: Record<
  string,
  { title: string; description: string; actionLabel?: string }
> = {
  all: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "등록된 행사가 없어요",
  },
  closed: {
    description: "종료된 행사가 아직 없어요",
    title: "지난 행사가 없어요",
  },
  open: {
    actionLabel: "아카이빙 둘러보기",
    description: "지난 행사의 활동을 확인해 보세요",
    title: "모집 중인 행사가 없어요",
  },
  upcoming: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "모집 예정인 행사가 없어요",
  },
};

interface EventsListProps {
  statusFilter: string;
  onSelect: (eventId: string) => void;
  onApply: (eventId: string) => void;
}

// 행사 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 EventsListScreen의 Suspense가
// EventsListSkeleton을 보여준다. 이동 같은 화면 동작은 Screen이 콜백으로 넘긴다.
function EventsList({ statusFilter, onSelect, onApply }: EventsListProps) {
  const events = use(fetchEvents());

  // 빌릴게 카테고리 필터와 달리 모집 상태는 목데이터에 이미 들어있어서 실제로 걸러낼 수 있다.
  const visibleEvents =
    statusFilter === "all"
      ? events
      : events.filter((event) => event.status === statusFilter);

  if (visibleEvents.length === 0) {
    return (
      // Figma는 Empty State를 목록 영역(헤더·Bottom Nav 사이) 가운데에 둔다.
      // 카드 목록과 같은 gap-6 래퍼 안에 넣으면 flex-1이 높이를 못 받아 위에 붙어버려서,
      // 빈 목록일 때는 래퍼를 대체해 h-full로 가운데 정렬한다.
      <div className="flex h-full items-center justify-center">
        <EventsEmptyState
          {...(EMPTY_STATE_BY_FILTER[statusFilter] ??
            EMPTY_STATE_BY_FILTER.all)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      {visibleEvents.map((event, index) => (
        <Fragment key={event.id}>
          {index > 0 && (
            <div className="px-5">
              <Divider color="semantic.line.normal.alternative" />
            </div>
          )}
          <EventsCard
            actionLabel={event.actionLabel}
            eventDate={event.eventDate}
            onApply={() => onApply(event.id)}
            onSelect={() => onSelect(event.id)}
            status={event.status}
            statusLabel={event.statusLabel}
            title={event.title}
          />
        </Fragment>
      ))}
    </div>
  );
}

export default EventsList;
