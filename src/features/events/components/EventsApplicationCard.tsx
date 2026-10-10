import { Button, ContentBadge, Typography } from "@wanteddev/wds";

import type { MyEventApplication } from "@/entities/events/types";

interface EventsApplicationCardProps {
  application: MyEventApplication;
  onSelectEvent: () => void;
  onSelectApplication: () => void;
}

const STATUS_BADGES = {
  applied: { color: "green", label: "신청완료" },
  cancelled: { color: "red", label: "신청취소" },
} as const;

// "2026-06-04T13:00" → "2026.06.04 13:00"
function formatDateTime(value: string) {
  return value.replace("T", " ").replaceAll("-", ".");
}

// Figma: ApplicationHistory Card (nodeId 1133:46176, 신청취소 1133:46180) — Stream 로컬 카드.
// 날짜 줄은 신청완료면 신청 일시, 신청취소면 취소 일시다.
// 두 버튼은 WDS Button size="small"이 padding 7/14·radius 8·Label 2/Medium까지 Figma와 같다 —
// `행사 상세`는 outlined, `신청 상세`는 solid(Fill/Normal 배경)이고 색은 둘 다 assistive다.
function EventsApplicationCard({
  application,
  onSelectEvent,
  onSelectApplication,
}: EventsApplicationCardProps) {
  const badge = STATUS_BADGES[application.status];
  const isCancelled =
    application.status === "cancelled" && application.cancelledAt !== null;
  const dateLabel = isCancelled
    ? `${formatDateTime(application.cancelledAt ?? "")} 취소`
    : `${formatDateTime(application.appliedAt)} 신청`;

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex items-center gap-3">
        {/* 행사 이미지 API 전까지는 행사 목록 카드와 같은 단색 자리 */}
        <div className="size-17.5 shrink-0 rounded-xl bg-thumbnail-placeholder" />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <ContentBadge
            accentColor={`semantic.accent.foreground.${badge.color}`}
            color="accent"
            size="small"
            variant="solid"
          >
            {badge.label}
          </ContentBadge>
          <div className="flex flex-col gap-0.5">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="body2"
              weight="bold"
            >
              {application.eventTitle}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {dateLabel}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Button
            color="assistive"
            fullWidth
            onClick={onSelectEvent}
            size="small"
            variant="outlined"
          >
            행사 상세
          </Button>
        </div>
        <div className="flex-1">
          <Button
            color="assistive"
            fullWidth
            onClick={onSelectApplication}
            size="small"
            variant="solid"
          >
            신청 상세
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EventsApplicationCard;
