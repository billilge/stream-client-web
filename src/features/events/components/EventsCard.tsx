import { Button, Typography } from "@wanteddev/wds";

import EventsStatusBadge from "@/features/events/components/EventsStatusBadge";
import type { EventStatus } from "@/features/events/constants/events";

interface EventsCardProps {
  title: string;
  /** 이미 포맷된 표시용 문자열 (예: "행사일 2026.06.04") */
  eventDate: string;
  status: EventStatus;
  /** 뱃지 문구 — 모집중은 "신청마감 D-2"처럼 마감까지 남은 일수가 들어가서 상태만으로 못 정한다 */
  statusLabel: string;
  /** CTA 문구 — 상태별로 "신청하기" / "8월 10일 오픈" / "모집종료"로 갈린다 */
  actionLabel: string;
  onApply?: () => void;
  /** 카드(CTA 제외 영역) 탭 — 상세 화면으로 보낸다 */
  onSelect?: () => void;
}

// Figma: Event-card (nodeId 1243:70867 모집중 / 1243:70869 모집예정 / 1243:70871 모집종료)
// Stream 로컬 카드다(wds-component-usage.md "제외됨" 표의 `Event-card`). 내부 요소만 WDS로 채운다.
//
// CTA는 Figma에서 `Menu/Resource/Action Area/Trailing Content/Button`인데, 빌릴게 카드와 달리
// 색 보정이 필요 없다 — WDS Button의 size="small"이 padding 7/14·radius 8·label2로 Figma와 맞고,
// disabled 상태 색(label.assistive + interaction.disable)도 모집예정/모집종료 스펙과 그대로 일치한다
// (button/style.js의 &[aria-disabled='true'] 블록 확인). 그래서 sx 없이 disabled prop만 쓴다.
function EventsCard({
  title,
  eventDate,
  status,
  statusLabel,
  actionLabel,
  onApply,
  onSelect,
}: EventsCardProps) {
  const isOpen = status === "open";

  return (
    <div className="flex items-center gap-3 px-5">
      {/* 실제 행사 이미지 API 전까지는 Figma와 같은 단색 placeholder.
          CTA 버튼 안에 버튼을 중첩할 수 없어서, 상세 진입은 썸네일과 텍스트 블록에만 건다. */}
      <button
        aria-label={`${title} 상세 보기`}
        className="size-28 shrink-0 rounded-xl bg-thumbnail-placeholder"
        onClick={onSelect}
        type="button"
      />

      {/* Figma에서 오른쪽 칼럼은 썸네일과 같은 높이(112)에 justify-between이라 뱃지는 위, 버튼은 아래 끝에 붙는다 */}
      <div className="flex h-28 min-w-px flex-1 flex-col justify-between">
        <button
          className="flex flex-col items-start gap-1 text-left"
          onClick={onSelect}
          type="button"
        >
          <EventsStatusBadge status={status} statusLabel={statusLabel} />

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
        </button>

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

export default EventsCard;
