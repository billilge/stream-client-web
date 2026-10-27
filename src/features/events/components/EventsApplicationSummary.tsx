import StatusSummaryCard from "@/components/ui/StatusSummaryCard";
import type { MyEventApplication } from "@/entities/events/types";
import { EVENTS_APPLICATION_STATUS_BADGES } from "@/features/events/constants/events";
import { formatDateTime } from "@/lib/date";

// Figma: 신청내역 상세 Event Summary (nodeId 1133:46188), 신청취소 상세 (1133:46223).
// 신청내역에서 "행사·신청·(취소)" 행을 만들어 공용 StatusSummaryCard에 넘긴다 — 취소 행은 취소된 신청에만 있다.
// 신청 폼·완료 화면의 EventsSummaryCard(아이콘 + 일시·장소)와는 다른 카드다.
function EventsApplicationSummary({
  application,
}: {
  application: MyEventApplication;
}) {
  const rows = [
    {
      label: "행사",
      value: `${formatDateTime(application.eventDateTime)} · ${application.location}`,
    },
    { label: "신청", value: formatDateTime(application.appliedAt) },
    ...(application.status === "cancelled"
      ? [
          {
            label: "취소",
            value: formatDateTime(application.cancelledAt),
          },
        ]
      : []),
  ];

  return (
    <StatusSummaryCard
      badge={EVENTS_APPLICATION_STATUS_BADGES[application.status]}
      rows={rows}
      title={application.eventTitle}
    />
  );
}

export default EventsApplicationSummary;
