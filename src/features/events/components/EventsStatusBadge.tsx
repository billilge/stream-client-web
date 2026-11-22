import { ContentBadge } from "@wanteddev/wds";

import type { EventRecruitStatus } from "@/shared/entities/events/eventsTypes";

interface EventsStatusBadgeProps {
  status: EventRecruitStatus;
  statusLabel: string;
  applied?: boolean;
  size?: "small" | "medium";
}

const STATUS_BADGE = {
  BEFORE_OPEN: { color: "accent", token: "semantic.accent.foreground.cyan" },
  CLOSED: { color: "neutral", token: "semantic.label.alternative" },
  OPEN: { color: "accent", token: "semantic.accent.foreground.redOrange" },
} as const;

const APPLIED_BADGE = {
  medium: { color: "accent", token: "semantic.primary.normal" },
  small: { color: "accent", token: "semantic.accent.foreground.blue" },
} as const;

function EventsStatusBadge({
  status,
  statusLabel,
  applied = false,
  size = "small",
}: EventsStatusBadgeProps) {
  const badge = applied ? APPLIED_BADGE[size] : STATUS_BADGE[status];

  return (
    <ContentBadge
      accentColor={badge.color === "accent" ? badge.token : undefined}
      color={badge.color}
      neutralColor={badge.color === "neutral" ? badge.token : undefined}
      size={size}
      variant="solid"
    >
      {applied ? "신청완료" : statusLabel}
    </ContentBadge>
  );
}

export default EventsStatusBadge;
