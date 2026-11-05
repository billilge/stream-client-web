import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Divider } from "@wanteddev/wds";
import { Fragment } from "react";
import emptyEventsIllustration from "@/assets/icons/common/empty-events.svg";
import EmptyState from "@/components/ui/EmptyState";
import EventsCard from "@/features/events/components/EventsCard";
import type { EventStatusFilter } from "@/features/events/constants/events";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { eventsQueries } from "@/shared/entities/events/eventsQueries";

// Figma: 행사 모집중 empty (nodeId 1165:62713)는 "모집중" 필터 버전만 준다 —
// 일러스트·레이아웃·"아카이빙 둘러보기" 버튼이 이 조합의 스펙이다.
// 나머지 필터 문구는 디자인에 없어서 같은 톤으로 맞춰 쓴 것이고, 확정 문구가 나오면 교체한다.
// 버튼은 Figma가 지정한 모집중에만 노출한다 — 모집종료 필터에서 "지난 행사를 보세요"는 모순이 된다.
const EMPTY_STATE_BY_FILTER: Record<
  EventStatusFilter,
  { title: string; description: string; hasArchivesAction?: boolean }
> = {
  all: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "등록된 행사가 없어요",
  },
  BEFORE_OPEN: {
    description: "새로운 행사가 열리면 알려드릴게요",
    title: "모집 예정인 행사가 없어요",
  },
  CLOSED: {
    description: "종료된 행사가 아직 없어요",
    title: "지난 행사가 없어요",
  },
  OPEN: {
    hasArchivesAction: true,
    description: "지난 행사의 활동을 확인해 보세요",
    title: "모집 중인 행사가 없어요",
  },
};

interface EventsListProps {
  statusFilter: EventStatusFilter;
  onSelect: (eventId: string) => void;
  onApply: (eventId: string) => void;
  onViewApplication: (applicationId: string) => void;
  onBrowseArchives: () => void;
}

// 행사 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 EventsListScreen의 Suspense가
// EventsListSkeleton을 보여준다. 이동 같은 화면 동작은 Screen이 콜백으로 넘긴다.
function EventsList({
  statusFilter,
  onSelect,
  onApply,
  onViewApplication,
  onBrowseArchives,
}: EventsListProps) {
  // 모집 상태는 서버가 걸러 준다 — 페이지로 나눠 받아서 받은 것만 거르면 다음 페이지의 행사가 빠진다
  const {
    data: events,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...eventsQueries.list(statusFilter === "all" ? null : statusFilter),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });

  if (events.length === 0) {
    const emptyState = EMPTY_STATE_BY_FILTER[statusFilter];
    return (
      // Figma는 Empty State를 목록 영역(헤더·Bottom Nav 사이) 가운데에 둔다.
      // 카드 목록과 같은 gap-6 래퍼 안에 넣으면 flex-1이 높이를 못 받아 위에 붙어버려서,
      // 빈 목록일 때는 래퍼를 대체해 h-full로 가운데 정렬한다.
      <div className="flex h-full items-center justify-center">
        <EmptyState
          action={
            emptyState.hasArchivesAction
              ? { label: "아카이빙 둘러보기", onClick: onBrowseArchives }
              : undefined
          }
          description={emptyState.description}
          descriptionWeight="medium"
          illustration={emptyEventsIllustration}
          title={emptyState.title}
        />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="flex flex-col gap-6">
        {events.map((event, index) => (
          <Fragment key={event.eventId}>
            {index > 0 && (
              <div className="px-5">
                <Divider color="semantic.line.normal.alternative" />
              </div>
            )}
            <EventsCard
              event={event}
              onApply={() => onApply(String(event.eventId))}
              onSelect={() => onSelect(String(event.eventId))}
              onViewApplication={(applicationId) =>
                onViewApplication(String(applicationId))
              }
            />
          </Fragment>
        ))}
      </div>
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </div>
  );
}

export default EventsList;
