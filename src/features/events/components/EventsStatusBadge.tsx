import { ContentBadge } from "@wanteddev/wds";

import type { EventStatus } from "@/features/events/constants/events";

interface EventsStatusBadgeProps {
  status: EventStatus;
  /** 뱃지 문구 — 모집중은 "신청마감 D-2"처럼 마감까지 남은 일수가 들어가서 상태만으로 못 정한다 */
  statusLabel: string;
  /** 목록 카드는 small(캡션 12px), 상세는 medium(라벨 13px) — Figma 스펙이 화면마다 다르다 */
  size?: "small" | "medium";
}

// 뱃지 색은 상태에 1:1로 묶인다. WDS ContentBadge가 color="accent"일 때 배경을 accentColor의
// 8% 오퍼시티로 깔고 글자를 원색으로 쓰는데(content-badge/style.js의 contentBadgeColorStyle),
// 이게 Figma의 "accent 색 + Opacity 8% 배경 레이어" 구조와 정확히 같다.
// 모집종료만 accent가 아니라 neutral이라 배경이 Fill/Normal로 바뀐다 — 이것도 WDS 쪽 분기와 일치한다.
const STATUS_BADGE = {
  closed: { color: "neutral", token: "semantic.label.alternative" },
  open: { color: "accent", token: "semantic.accent.foreground.redOrange" },
  upcoming: { color: "accent", token: "semantic.accent.foreground.cyan" },
} as const;

// Figma: Content Badge/Content Badge (메인 컴포넌트 445:5656)
// 목록 카드(1243:70867 등)와 상세(1133:42440 / 1156:53999)가 같은 상태-색 규칙을 쓰기 때문에
// 매핑을 두 곳에 적지 않도록 여기로 모았다. 화면별로 다른 건 size뿐이다.
function EventsStatusBadge({
  status,
  statusLabel,
  size = "small",
}: EventsStatusBadgeProps) {
  const badge = STATUS_BADGE[status];

  return (
    <ContentBadge
      accentColor={badge.color === "accent" ? badge.token : undefined}
      color={badge.color}
      neutralColor={badge.color === "neutral" ? badge.token : undefined}
      size={size}
      variant="solid"
    >
      {statusLabel}
    </ContentBadge>
  );
}

export default EventsStatusBadge;
