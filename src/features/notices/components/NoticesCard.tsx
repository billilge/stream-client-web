import { Typography } from "@wanteddev/wds";

import pinIcon from "@/assets/icons/pin.svg";
import LazyImage from "@/components/ui/LazyImage";

interface NoticesCardProps {
  title: string;
  date: string;
  category: string;
  isPinned?: boolean;
  hasThumbnail?: boolean;
  /** 서버가 준 썸네일 주소 — 있으면 실제 이미지를 그리고, 없으면 회색 칸을 그린다(hasThumbnail일 때) */
  thumbnailUrl?: string | null;
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
  thumbnailUrl,
}: NoticesCardProps) {
  // 썸네일이 있으면 제목이 한 줄(noWrap)이라, 글 칸이 제목 길이만큼 버티지 않게 min-w-0으로 줄여서 썸네일 앞에서
  // 말줄임되게 한다. Figma는 제목이 짧아 제목·썸네일 사이 간격이 없는데, 말줄임표가 썸네일에 붙지 않게 12를 둔다.
  return (
    <div
      className={`flex w-full items-center justify-between gap-3 px-5 ${hasThumbnail ? "" : "py-[7px]"}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* 고정 공지의 핀은 썸네일 유무와 상관없이 제목 앞에 붙는다. 썸네일이 없으면 제목이 여러 줄로 이어진다 */}
        <div className="flex items-center gap-1">
          {isPinned && <img alt="" className="size-5 shrink-0" src={pinIcon} />}
          <Typography
            color="semantic.label.normal"
            noWrap={hasThumbnail}
            variant="body2"
            weight="medium"
          >
            {title}
          </Typography>
        </div>
        <Typography
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          {date} | {category}
        </Typography>
      </div>
      {hasThumbnail &&
        (thumbnailUrl ? (
          <LazyImage
            alt=""
            className="size-14 shrink-0 rounded-lg"
            src={thumbnailUrl}
          />
        ) : (
          <div className="size-14 shrink-0 rounded-lg bg-thumbnail-placeholder" />
        ))}
    </div>
  );
}

export default NoticesCard;
