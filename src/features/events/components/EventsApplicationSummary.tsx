import StatusSummaryCard from "@/components/ui/StatusSummaryCard";
import { EVENTS_APPLICATION_STATUS_BADGES } from "@/features/events/constants/events";
import { formatDateTime } from "@/lib/date";
import type { MyEventApplicationDetail } from "@/shared/entities/events/eventsTypes";

// Figma: 신청내역 상세 Event Summary (nodeId 1133:46188), 신청취소 상세 (1133:46223).
// 신청내역에서 "행사·신청·(취소)" 행을 만들어 공용 StatusSummaryCard에 넘긴다 — 취소 행은 취소된 신청에만 있다.
// 신청 폼·완료 화면의 EventsSummaryCard(아이콘 + 일시·장소)와는 다른 카드다.
function EventsApplicationSummary({
  application,
}: {
  application: Pick<
    MyEventApplicationDetail,
    | "title"
    | "eventStartAt"
    | "place"
    | "applicationStatus"
    | "appliedAt"
    | "canceledAt"
  >;
}) {
  const eventDateTime = formatDateTime(application.eventStartAt);
  const rows = [
    {
      label: "행사",
      // 장소가 없는 행사(서버 place null)는 일시만 쓴다
      value:
        application.place === null
          ? eventDateTime
          : `${eventDateTime} · ${application.place}`,
    },
    { label: "신청", value: formatDateTime(application.appliedAt) },
    ...(application.canceledAt === null
      ? []
      : [
          {
            label: "취소",
            value: formatDateTime(application.canceledAt),
          },
        ]),
  ];

  return (
    <StatusSummaryCard
      badge={EVENTS_APPLICATION_STATUS_BADGES[application.applicationStatus]}
      rows={rows}
      title={application.title}
    />
  );
}

export default EventsApplicationSummary;
