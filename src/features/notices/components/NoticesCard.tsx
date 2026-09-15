import { Typography } from "@wanteddev/wds";

import pinIcon from "@/assets/icons/pin.svg";

interface NoticesCardProps {
  title: string;
  date: string;
  category: string;
  isPinned?: boolean;
  hasThumbnail?: boolean;
}

// Figma: Notice-card (nodeId 1256:81801) — Stream 로컬 컴포넌트, WDS 아님
// (docs/conventions/wds-component-usage.md "제외됨" 표 참고)
// 고정 핀 아이콘은 Icon/Normal/Pin(WDS)으로 오판했던 것을 재검증해서 바로잡음 — 실제 Figma
// 에셋은 기울어진 모양 + #0066FF 고정색이라 wds-icon의 IconPin/IconPinFill(직선 모양)과
// 다른 도형이라 대응 export가 없다. src/assets/icons/pin.svg로 원본 SVG를 그대로 받아 씀.
function NoticesCard({
  title,
  date,
  category,
  isPinned = false,
  hasThumbnail = false,
}: NoticesCardProps) {
  return (
    <div
      className={`flex w-full items-center justify-between px-5 ${hasThumbnail ? "" : "py-[7px]"}`}
    >
      <div className="flex flex-1 flex-col gap-1">
        {hasThumbnail ? (
          <div className="flex items-center gap-1">
            {isPinned && <img alt="" className="size-5" src={pinIcon} />}
            <Typography
              color="semantic.label.normal"
              noWrap
              variant="body2"
              weight="medium"
            >
              {title}
            </Typography>
          </div>
        ) : (
          <Typography
            color="semantic.label.normal"
            variant="body2"
            weight="medium"
          >
            {title}
          </Typography>
        )}
        <Typography
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          {date} | {category}
        </Typography>
      </div>
      {hasThumbnail && (
        <div className="size-14 shrink-0 rounded-lg bg-thumbnail-placeholder" />
      )}
    </div>
  );
}

export default NoticesCard;
