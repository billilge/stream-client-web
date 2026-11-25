import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ActionArea,
  ActionAreaButton,
  Divider,
  TopNavigationButton,
  Typography,
} from "@wanteddev/wds";
import { IconChevronLeft } from "@wanteddev/wds-icon";

import emptyEventsIllustration from "@/assets/icons/common/empty-events.svg";
import EmptyState from "@/components/ui/EmptyState";
import PhotoGallery from "@/components/ui/PhotoGallery";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import EventsStatusBadge from "@/features/events/components/EventsStatusBadge";
import {
  EVENTS_FEE_PAID_ONLY_LABEL,
  getEventAudience,
  getEventDetailActionLabel,
  getEventSchedule,
  getEventStatusLabel,
} from "@/features/events/constants/events";
import { eventsQueries } from "@/shared/entities/events/eventsQueries";

interface EventsDetailContentProps {
  eventId: string;
  onBack: () => void;
  onApply: (eventId: string) => void;
  onViewApplication: (applicationId: string) => void;
}

function EventsDetailContent({
  eventId,
  onBack,
  onApply,
  onViewApplication,
}: EventsDetailContentProps) {
  const { data: event } = useSuspenseQuery(eventsQueries.detail(eventId));
  const photoCount = event?.images.length ?? 0;

  useScreenHeader(
    photoCount > 0 ? null : (
      <ScreenHeader
        leading={
          <TopNavigationButton
            aria-label="뒤로가기"
            onClick={onBack}
            variant="icon"
          >
            <IconChevronLeft />
          </TopNavigationButton>
        }
        variant="normal"
      />
    ),
  );

  if (!event) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          description="목록에서 다시 선택해 주세요"
          descriptionWeight="medium"
          illustration={emptyEventsIllustration}
          title="행사를 찾을 수 없어요"
        />
      </div>
    );
  }

  const isFeeRequired = !event.isFeeEligible;
  const canApply = event.recruitStatus === "OPEN" && !isFeeRequired;
  const applyLabel =
    event.recruitStatus === "OPEN" && isFeeRequired
      ? EVENTS_FEE_PAID_ONLY_LABEL
      : getEventDetailActionLabel(event);
  const { applicationId } = event;
  const action =
    applicationId === null
      ? {
          disabled: !canApply,
          label: applyLabel,
          onClick: () => onApply(eventId),
        }
      : {
          disabled: false,
          label: "신청내역 보기",
          onClick: () => onViewApplication(String(applicationId)),
        };
  const hasActionArea =
    applicationId !== null || event.recruitStatus !== "CLOSED";

  return (
    <div className="relative flex-1 overflow-hidden bg-background-normal">
      <div className="scrollbar-hidden h-full overflow-y-auto">
        {photoCount > 0 && (
          <PhotoGallery
            idPrefix={eventId}
            key={eventId}
            overlay={
              <div className="absolute top-4 left-4 z-10">
                <TopNavigationButton
                  aria-label="뒤로가기"
                  onClick={onBack}
                  variant="icon"
                >
                  <IconChevronLeft className="text-white" />
                </TopNavigationButton>
              </div>
            }
            photos={event.images.map((image, index) => ({
              alt: `${event.title} 사진 ${index + 1}`,
              src: image.fileUrl,
            }))}
            showCounter={photoCount > 1}
            slideClassName="aspect-square"
          />
        )}

        <div
          className={`flex flex-col gap-5 px-5 ${photoCount > 0 ? "pt-5" : ""}`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-2">
              <EventsStatusBadge
                applied={event.applicationId !== null}
                size="medium"
                status={event.recruitStatus}
                statusLabel={getEventStatusLabel(event)}
              />
              <Typography
                as="h1"
                color="semantic.label.normal"
                variant="heading2"
                weight="bold"
              >
                {event.title}
              </Typography>
            </div>

            <div className="flex gap-3">
              <div className="flex shrink-0 flex-col gap-2">
                {(event.place === null
                  ? ["일시", "대상"]
                  : ["일시", "장소", "대상"]
                ).map((label) => (
                  <Typography
                    color="semantic.label.alternative"
                    key={label}
                    variant="label1"
                    weight="medium"
                  >
                    {label}
                  </Typography>
                ))}
              </div>
              <div className="flex min-w-px flex-1 flex-col gap-2">
                <Typography
                  color="semantic.label.neutral"
                  variant="label1"
                  weight="medium"
                >
                  {getEventSchedule(event)}
                </Typography>
                {event.place !== null && (
                  <Typography
                    color="semantic.label.neutral"
                    variant="label1"
                    weight="medium"
                  >
                    {event.place}
                  </Typography>
                )}
                <div className="flex flex-col">
                  {getEventAudience(event).map((line) => (
                    <Typography
                      color="semantic.label.neutral"
                      key={line}
                      variant="label1"
                      weight="medium"
                    >
                      {line}
                    </Typography>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Divider color="semantic.line.normal.alternative" />

          <Typography
            color="semantic.label.normal"
            sx={{ whiteSpace: "pre-wrap" }}
            variant="label1-reading"
            weight="regular"
          >
            {event.description}
          </Typography>
        </div>

        {hasActionArea && <div className="h-24 sm:h-[110px]" />}
      </div>

      {hasActionArea && (
        <div className="absolute inset-x-0 bottom-0">
          <ActionArea background>
            <ActionAreaButton
              disabled={action.disabled}
              onClick={action.onClick}
              sx={{ paddingBlock: "16px" }}
            >
              {action.label}
            </ActionAreaButton>
          </ActionArea>
          <div className="h-safe-bottom-extra bg-background-elevated-normal sm:h-[14px]" />
        </div>
      )}
    </div>
  );
}

export default EventsDetailContent;
