import { Button, ContentBadge, Typography } from "@wanteddev/wds";

import type { EventStatus } from "@/features/events/constants/events";

interface EventCardProps {
  title: string;
  /** 이미 포맷된 표시용 문자열 (예: "행사일 2026.06.04") */
  eventDate: string;
  status: EventStatus;
  /** 뱃지 문구 — 모집중은 "신청마감 D-2"처럼 마감까지 남은 일수가 들어가서 상태만으로 못 정한다 */
  statusLabel: string;
  /** CTA 문구 — 상태별로 "신청하기" / "8월 10일 오픈" / "모집종료"로 갈린다 */
  actionLabel: string;
  onApply?: () => void;
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

// Figma: Event-card (nodeId 1243:70867 모집중 / 1243:70869 모집예정 / 1243:70871 모집종료)
// Stream 로컬 카드다(wds-component-usage.md "제외됨" 표의 `Event-card`). 내부 요소만 WDS로 채운다.
//
// CTA는 Figma에서 `Menu/Resource/Action Area/Trailing Content/Button`인데, 빌릴게 카드와 달리
// 색 보정이 필요 없다 — WDS Button의 size="small"이 padding 7/14·radius 8·label2로 Figma와 맞고,
// disabled 상태 색(label.assistive + interaction.disable)도 모집예정/모집종료 스펙과 그대로 일치한다
// (button/style.js의 &[aria-disabled='true'] 블록 확인). 그래서 sx 없이 disabled prop만 쓴다.
function EventCard({
  title,
  eventDate,
  status,
  statusLabel,
  actionLabel,
  onApply,
}: EventCardProps) {
  const badge = STATUS_BADGE[status];
  const isOpen = status === "open";

  return (
    <div className="flex items-center gap-3 px-5">
      {/* 실제 행사 이미지 API 전까지는 Figma와 같은 단색 placeholder */}
      <div className="size-28 shrink-0 rounded-xl bg-thumbnail-placeholder" />

      {/* Figma에서 오른쪽 칼럼은 썸네일과 같은 높이(112)에 justify-between이라 뱃지는 위, 버튼은 아래 끝에 붙는다 */}
      <div className="flex h-28 min-w-px flex-1 flex-col justify-between">
        <div className="flex flex-col items-start gap-1">
          <ContentBadge
            accentColor={badge.color === "accent" ? badge.token : undefined}
            color={badge.color}
            neutralColor={badge.color === "neutral" ? badge.token : undefined}
            size="small"
            variant="solid"
          >
            {statusLabel}
          </ContentBadge>

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
            {eventDate}
          </Typography>
        </div>

        <div className="flex justify-end">
          <Button
            color="primary"
            disabled={!isOpen}
            onClick={onApply}
            size="small"
            variant="solid"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
