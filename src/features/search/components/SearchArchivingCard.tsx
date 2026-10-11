import { Typography } from "@wanteddev/wds";

interface SearchArchivingCardProps {
  title: string;
  date: string;
}

// Figma: Search Archiving Card (nodeId 3013:127633) — Stream 로컬 카드, WDS 아님. 검색 결과 전용이라
// 이 feature 안에 둔다(설계서 4번: 기존 카드와 달라지는 카드 — 아카이빙·빌릴게). 아카이빙 상세 화면이
// 아직 없어서 눌러도 이동하지 않는다.
// 썸네일은 실 이미지 API 전까지 Figma와 같은 단색 placeholder다.
function SearchArchivingCard({ title, date }: SearchArchivingCardProps) {
  return (
    <div className="flex items-center gap-3 px-5">
      <div className="size-14 shrink-0 rounded-lg bg-thumbnail-placeholder" />
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
