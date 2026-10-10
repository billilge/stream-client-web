import { Button, Divider, Typography } from "@wanteddev/wds";

import emptyEvents from "@/assets/icons/events/empty-events.svg";
import arrowRight from "@/assets/icons/home/arrow-right.svg";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import type { HomeAppliedEvent } from "@/features/home/constants/homeMock";

const VISIBLE_COUNT = 2;

// Figma: Event Applications 1건 (nodeId 3147:146275), 3건 이상 (3147:146335), empty (3562:163940)
// 제목의 건수는 Figma대로 3건 이상일 때만 붙는다.
interface HomeAppliedEventSectionProps {
  events: HomeAppliedEvent[];
  onSelect: (event: HomeAppliedEvent) => void;
  // 더보기 → 행사 신청내역 탭
  onMore: () => void;
  // 빈 상태 → 행사 목록
  onBrowse: () => void;
}

function HomeAppliedEventSection({
  events,
  onSelect,
  onMore,
  onBrowse,
}: HomeAppliedEventSectionProps) {
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

  const hiddenCount = events.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="medium"
      >
        {hiddenCount > 0 ? `신청한 행사 · ${events.length}건` : "신청한 행사"}
      </Typography>
      {events.slice(0, VISIBLE_COUNT).map((event) => (
        <button
          className="flex items-center justify-between gap-3 text-left"
          key={event.id}
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
              {event.name}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="caption1"
              weight="regular"
            >
              행사까지 D-{event.daysUntilEvent}
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
