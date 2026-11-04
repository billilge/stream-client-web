import { ContentBadge, Typography } from "@wanteddev/wds";

interface BillilgeRentalHistoryEntryProps {
  // 물품이 지워졌거나 아이콘이 없으면 null이라 같은 크기의 빈 자리만 둔다
  icon: string | null;
  itemName: string;
  rentedAt: string;
  // 반납이 확인되기 전(반납완료가 아닌 상태)은 시각이 없어 "-"로 자리를 채워 줄 높이를 맞춘다
  returnedAt: string;
}

// Figma: RentalHistory Card (nodeId 1243:74983) — Rental History List 안에서 divider(new)로
// 구분되며 반복되는 한 줄. "반납완료" 뱃지는 WDS `ContentBadge`(color="accent",
// accentColor="semantic.accent.foreground.green", size="small")가 배경 8% 투명도·라운드 8px·
// Caption 1/Medium까지 정확히 일치해서 그대로 재사용한다.
function BillilgeRentalHistoryEntry({
  icon,
  itemName,
  rentedAt,
  returnedAt,
}: BillilgeRentalHistoryEntryProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center gap-3">
        {icon ? (
          <img alt="" className="size-[42px]" src={icon} />
        ) : (
          <div className="size-[42px]" />
        )}
        <div className="flex flex-col gap-1">
          <Typography
            as="p"
            color="semantic.label.normal"
            variant="label1"
            weight="bold"
          >
            {itemName}
          </Typography>
          <div className="flex items-center gap-1.5">
            <Typography color="semantic.label.alternative" variant="caption1">
              대여
            </Typography>
            <Typography color="semantic.label.neutral" variant="caption1">
              {rentedAt}
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            <Typography color="semantic.label.alternative" variant="caption1">
              반납
            </Typography>
            <Typography color="semantic.label.neutral" variant="caption1">
              {returnedAt}
            </Typography>
          </div>
        </div>
      </div>
      <ContentBadge
        accentColor="semantic.accent.foreground.green"
        color="accent"
        size="small"
        variant="solid"
      >
        반납완료
      </ContentBadge>
    </div>
  );
}

export default BillilgeRentalHistoryEntry;
