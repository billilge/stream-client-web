import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@wanteddev/wds";
import arrowRight from "@/assets/icons/common/arrow-right.svg";
import emptyEvents from "@/assets/icons/common/empty-events.svg";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import { formatDday } from "@/lib/date";
import { homeQueries } from "@/shared/entities/home/homeQueries";
import type {
  HomeAppliedEvent,
  HomeResponse,
} from "@/shared/entities/home/homeTypes";

function selectAppliedEvents(home: HomeResponse) {
  return home.appliedEvents;
}

// Figma: Event Applications 1건 (nodeId 3147:146275), 3건 이상 (3147:146335), empty (3562:163940)
// 제목의 건수는 Figma대로 3건 이상일 때만 붙는다. 서버가 앞의 2건과 전체 수만 줘서 건수·더보기는 전체 수로 센다.
// 홈 데이터를 받는 동안은 HomeScreen의 Suspense가 HomeAppliedEventSkeleton을 보여준다.
interface HomeAppliedEventSectionProps {
  onSelect: (event: HomeAppliedEvent) => void;
  // 더보기 → 행사 신청내역 탭
  onMore: () => void;
  // 빈 상태 → 행사 목록
  onBrowse: () => void;
}

function HomeAppliedEventSection({
  onSelect,
  onMore,
  onBrowse,
}: HomeAppliedEventSectionProps) {
  const {
    data: { content: events, totalCount },
  } = useSuspenseQuery({
    ...homeQueries.home(),
    select: selectAppliedEvents,
  });

  if (events.length === 0) {
    return (
      <HomeEmptyState
        action={
          <Button
            onClick={onBrowse}
            size="small"
            sx={{
              backgroundColor: "var(--color-primary-subtle)",
              color: "var(--color-primary)",
            }}
          >
            행사 둘러보기
          </Button>
        }
        illustration={<img alt="" className="w-8.75" src={emptyEvents} />}
        message="관심 있는 행사를 둘러 보세요"
      />
    );
  }

  const hiddenCount = totalCount - events.length;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="medium"
      >
        {hiddenCount > 0 ? `신청한 행사 · ${totalCount}건` : "신청한 행사"}
      </Typography>
      {events.map((event) => (
        <button
          className="flex items-center justify-between gap-3 text-left"
          key={event.applicationId}
          onClick={() => onSelect(event)}
          type="button"
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              {event.title}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="caption1"
              weight="regular"
            >
              행사까지 {formatDday(event.eventDate)}
            </Typography>
          </div>
          <img alt="" className="-mr-1 size-3 shrink-0" src={arrowRight} />
        </button>
      ))}
      {hiddenCount > 0 && (
        <>
          <Divider color="semantic.line.normal.alternative" />
          <button onClick={onMore} type="button">
            <Typography
              align="center"
              as="span"
              color="semantic.primary.normal"
              display="block"
              variant="label1"
              weight="regular"
            >
              {hiddenCount}건 더보기
            </Typography>
          </button>
        </>
      )}
    </div>
  );
}

export default HomeAppliedEventSection;
