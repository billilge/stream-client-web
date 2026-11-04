import { Typography } from "@wanteddev/wds";

import LazyImage from "@/components/ui/LazyImage";

interface SearchArchivingCardProps {
  title: string;
  date: string;
  /** 서버가 준 대표 사진 — 없으면 회색 칸을 그린다 */
  thumbnailUrl: string | null;
}

// Figma: Search Archiving Card (nodeId 3013:127633) — Stream 로컬 카드, WDS 아님. 검색 결과 전용이라
// 이 feature 안에 둔다(설계서 4번: 기존 카드와 달라지는 카드 — 아카이빙·빌릴게).
function SearchArchivingCard({
  title,
  date,
  thumbnailUrl,
}: SearchArchivingCardProps) {
  return (
    <div className="flex items-center gap-3 px-5">
      {thumbnailUrl ? (
        <LazyImage
          alt=""
          className="size-14 shrink-0 rounded-lg"
          src={thumbnailUrl}
        />
      ) : (
        <div className="size-14 shrink-0 rounded-lg bg-thumbnail-placeholder" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography
          color="semantic.label.normal"
          noWrap
          variant="body2"
          weight="medium"
        >
          {title}
        </Typography>
        <Typography
          color="semantic.label.alternative"
          variant="caption1"
          weight="regular"
        >
          {date}
        </Typography>
      </div>
    </div>
  );
}

export default SearchArchivingCard;
