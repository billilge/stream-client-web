import { Button, Typography } from "@wanteddev/wds";
import LazyImage from "@/components/ui/LazyImage";
import EventsStatusBadge from "@/features/events/components/EventsStatusBadge";
import {
  getEventActionLabel,
  getEventStatusLabel,
} from "@/features/events/constants/events";
import { formatDate } from "@/lib/date";
import type { EventListItem } from "@/shared/entities/events/eventsTypes";

interface EventsCardProps {
  event: EventListItem;
  onApply?: () => void;
  onViewApplication?: (applicationId: number) => void;
  onSelect?: () => void;
}

function EventsCard({
  event,
  onApply,
  onViewApplication,
  onSelect,
}: EventsCardProps) {
  const { title, recruitStatus, thumbnailUrl, applicationId } = event;
  const isOpen = recruitStatus === "OPEN";

  return (
    <div className="relative isolate flex items-center gap-3 px-5">
      <button
        aria-label={`${title} 상세 보기`}
        className="absolute inset-0 z-10"
        onClick={onSelect}
        type="button"
      />

      <div className="size-28 shrink-0 overflow-hidden rounded-xl bg-thumbnail-placeholder">
        {thumbnailUrl && (
          <LazyImage alt="" className="size-full" src={thumbnailUrl} />
        )}
      </div>

      <div className="flex h-28 min-w-px flex-1 flex-col justify-between">
        <div className="flex flex-col items-start gap-1">
          <EventsStatusBadge
            applied={applicationId !== null}
            status={recruitStatus}
            statusLabel={getEventStatusLabel(event)}
          />

          <Typography
            color="semantic.label.normal"
            variant="body2"
            weight="bold"
          >
            {title}
          </Typography>
          <Typography
            color="semantic.label.alternative"
            variant="label2"
            weight="regular"
          >
            행사일 {formatDate(event.eventStartAt.slice(0, 10))}
          </Typography>
        </div>

        <div className="relative z-20 self-end">
          {applicationId === null ? (
            <Button
              color="primary"
              disabled={!isOpen}
              onClick={onApply}
              size="small"
              variant="solid"
            >
              {getEventActionLabel(event)}
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => onViewApplication?.(applicationId)}
              size="small"
              variant="outlined"
            >
              신청내역 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsCard;
