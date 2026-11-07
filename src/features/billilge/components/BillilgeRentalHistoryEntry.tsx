import { Typography } from "@wanteddev/wds";

import BillilgeItemIcon from "@/features/billilge/components/BillilgeItemIcon";
import BillilgeStatusBadge from "@/features/billilge/components/BillilgeStatusBadge";
import type { BillilgeRentalStatus } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeRentalHistoryEntryProps {
  // 물품이 지워졌거나 아이콘이 없으면 null이라 회색 칸만 둔다
  icon: string | null;
  itemName: string;
  rentedAt: string;
  // 반납이 확인되기 전(반납완료가 아닌 상태)은 시각이 없어 "-"로 자리를 채워 줄 높이를 맞춘다
  returnedAt: string;
  status: BillilgeRentalStatus;
}

// Figma: RentalHistory Card (nodeId 1243:74983) — Rental History List 안에서 divider(new)로
// 구분되며 반복되는 한 줄. 오른쪽 뱃지는 대여 상태(1133:50036의 8종)를 보여 준다.
function BillilgeRentalHistoryEntry({
  icon,
  itemName,
  rentedAt,
  returnedAt,
  status,
}: BillilgeRentalHistoryEntryProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center gap-3">
        <BillilgeItemIcon src={icon} />
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
      <BillilgeStatusBadge status={status} />
    </div>
  );
}

export default BillilgeRentalHistoryEntry;
