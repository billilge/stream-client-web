import { Button, Typography } from "@wanteddev/wds";
import LazyImage from "@/components/ui/LazyImage";
import EventsStatusBadge from "@/features/events/components/EventsStatusBadge";
import {
  getEventActionLabel,
  getEventStatusLabel,
} from "@/features/events/constants/events";
import { formatDate } from "@/lib/date";
import type { EventListItem } from "@/shared/entities/events/eventsTypes";

interface EventsCardProps {
  event: EventListItem;
  onApply?: () => void;
  /** 이미 신청한 행사의 "신청완료" 버튼 탭 — 신청내역 상세로 보낸다 */
  onViewApplication?: (applicationId: number) => void;
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
//
// 이미 신청한 행사는 모집 상태와 상관없이 "신청완료"를 outlined로 그리고, 누르면 신청내역 상세로 보낸다.
// Figma에 이 상태가 없어서 정한 것이다 — disabled로 막으면 모집예정·모집종료와 같은 회색이 돼 구분되지 않는다.
function EventsCard({
  event,
  onApply,
  onViewApplication,
  onSelect,
}: EventsCardProps) {
  const { title, recruitStatus, thumbnailUrl, applicationId } = event;
  const isOpen = recruitStatus === "OPEN";

  return (
    <div className="relative isolate flex items-center gap-3 px-5">
      {/* 버튼 안에 CTA 버튼을 중첩할 수 없어서, 상세 진입 버튼을 카드 전체에 덮어 깔고 CTA만 그 위로 올린다.
          isolate로 카드 안에서만 z 순서를 정해 목록 위에 겹치는 헤더 같은 요소와 섞이지 않게 한다. */}
      <button
        aria-label={`${title} 상세 보기`}
        className="absolute inset-0 z-10"
        onClick={onSelect}
        type="button"
      />

      {/* 썸네일이 없으면 Figma와 같은 단색 placeholder */}
      <div className="size-28 shrink-0 overflow-hidden rounded-xl bg-thumbnail-placeholder">
        {thumbnailUrl && (
          <LazyImage alt="" className="size-full" src={thumbnailUrl} />
        )}
      </div>

      {/* Figma에서 오른쪽 칼럼은 썸네일과 같은 높이(112)에 justify-between이라 뱃지는 위, 버튼은 아래 끝에 붙는다 */}
      <div className="flex h-28 min-w-px flex-1 flex-col justify-between">
        <div className="flex flex-col items-start gap-1">
          <EventsStatusBadge
            applied={applicationId !== null}
            status={recruitStatus}
            statusLabel={getEventStatusLabel(event)}
          />

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
            행사일 {formatDate(event.eventStartAt.slice(0, 10))}
          </Typography>
        </div>

        {/* CTA 옆 빈 자리는 상세 진입으로 남겨야 해서 래퍼를 줄 전체가 아니라 버튼 너비로만 둔다 */}
        <div className="relative z-20 self-end">
          {applicationId === null ? (
            <Button
              color="primary"
              disabled={!isOpen}
              onClick={onApply}
              size="small"
              variant="solid"
            >
              {getEventActionLabel(event)}
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => onViewApplication?.(applicationId)}
              size="small"
              variant="outlined"
            >
              신청완료
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsCard;
