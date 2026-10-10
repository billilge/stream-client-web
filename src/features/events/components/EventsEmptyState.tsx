import { Button, Typography } from "@wanteddev/wds";

import emptyEventsIllustration from "@/assets/icons/events/empty-events.svg";

interface EventsEmptyStateProps {
  title: string;
  description: string;
  /** 있을 때만 버튼을 노출한다 — Figma는 모집중 필터에만 "아카이빙 둘러보기"를 둔다 */
  actionLabel?: string;
  onAction?: () => void;
  /** 설명 굵기 — 행사 목록 empty(1165:62725)는 Medium, 신청내역 empty(1410:52742)는 Regular다 */
  descriptionWeight?: "medium" | "regular";
}

// Figma: 행사 모집중 empty > Empty State (nodeId 1165:62725)
// Stream 로컬 컴포넌트다(wds-component-usage.md "제외됨" 표의 `Empty State`).
// WDS에 FallbackView 계열이 있어 구조는 같지만 스펙이 달라서 쓰지 않았다 — WDS는 일러스트 128/160px에
// 상하 패딩 80/160px, 타이틀이 label.normal인데 Figma는 일러스트 81px·컨테이너 203px·타이틀 label/neutral이다.
// 내부를 오버라이드해야 맞출 수 있어서(컨벤션상 금지) 바깥 레이아웃만 로컬로 짜고 내부 요소는 WDS로 채운다.
function EventsEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  descriptionWeight = "medium",
}: EventsEmptyStateProps) {
  return (
    <div className="flex w-50.75 flex-col items-center gap-3">
      {/* Figma 그림 자리 81px(size-20.25). 그림(71×70.109)은 SVG 자체 크기로 가운데 둔다 */}
      <div className="flex size-20.25 shrink-0 items-center justify-center">
        <img alt="" src={emptyEventsIllustration} />
      </div>

      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-1 text-center">
          <Typography
            align="center"
            color="semantic.label.neutral"
            variant="headline1"
            weight="bold"
          >
            {title}
          </Typography>
          <Typography
            align="center"
            color="semantic.label.alternative"
            variant="label1"
            weight={descriptionWeight}
          >
            {description}
          </Typography>
        </div>

        {actionLabel && (
          // 행사 목록의 "아카이빙 둘러보기"는 아카이빙 화면이 아직 없어서 onAction 없이 둔다.
          // TODO: 아카이빙 목록 화면(billilge/stream-client-web#31)이 생기면 연결한다
          <Button
            color="assistive"
            onClick={onAction}
            size="small"
            variant="outlined"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EventsEmptyState;
