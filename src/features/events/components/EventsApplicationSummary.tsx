import { ContentBadge, Typography } from "@wanteddev/wds";

import type { MyEventApplication } from "@/entities/events/types";
import {
  EVENTS_APPLICATION_STATUS_BADGES,
  formatApplicationDateTime,
} from "@/features/events/constants/events";

// Figma: 신청내역 상세 Event Summary (nodeId 1133:46188), 신청취소 상세 (1133:46223) — Stream 로컬 카드.
// 신청 폼·완료 화면의 EventsSummaryCard(아이콘 + 일시·장소)와 달리 "행사·신청·취소" 라벨 행이라 따로 둔다.
function EventsApplicationSummary({
  application,
}: {
  application: MyEventApplication;
}) {
  const badge = EVENTS_APPLICATION_STATUS_BADGES[application.status];
  const rows = [
    {
      label: "행사",
      value: `${formatApplicationDateTime(application.eventDateTime)} · ${application.location}`,
    },
    { label: "신청", value: formatApplicationDateTime(application.appliedAt) },
    ...(application.cancelledAt
      ? [
          {
            label: "취소",
            value: formatApplicationDateTime(application.cancelledAt),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl bg-background-normal p-4">
      <ContentBadge
        accentColor={`semantic.accent.foreground.${badge.color}`}
        color="accent"
        size="small"
        variant="solid"
      >
        {badge.label}
      </ContentBadge>
      <Typography
        as="p"
        color="semantic.label.normal"
        variant="heading2"
        weight="bold"
      >
        {application.eventTitle}
      </Typography>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div className="flex gap-2" key={row.label}>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {row.label}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.neutral"
              variant="label2"
              weight="regular"
            >
              {row.value}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsApplicationSummary;
