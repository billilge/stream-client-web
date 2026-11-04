import { ContentBadge } from "@wanteddev/wds";

import { BILLILGE_STATUS_BADGES } from "@/features/billilge/constants/billilge";
import type { BillilgeRentalStatus } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeStatusBadgeProps {
  status: BillilgeRentalStatus;
}

// Figma: 빌릴게 대여내역 뱃지(1133:50036)의 Content Badge/Content Badge. WDS ContentBadge가 color="accent"면
// accentColor의 8% 배경에 원색 글자를, neutral이면 Fill/Normal 배경을 깔아서 Figma 구조와 같다
// (EventsStatusBadge와 같은 방식). 크기는 대여 내역 카드(1243:74983)에서 실측한 small이다.
function BillilgeStatusBadge({ status }: BillilgeStatusBadgeProps) {
  const badge = BILLILGE_STATUS_BADGES[status];

  return (
    <ContentBadge
      accentColor={badge.color === "accent" ? badge.token : undefined}
      color={badge.color}
      neutralColor={badge.color === "neutral" ? badge.token : undefined}
      size="small"
      variant="solid"
    >
      {badge.label}
    </ContentBadge>
  );
}

export default BillilgeStatusBadge;
