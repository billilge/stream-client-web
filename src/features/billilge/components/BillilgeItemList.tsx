import { useSuspenseQuery } from "@tanstack/react-query";

import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import {
  BILLILGE_ALL_CATEGORIES,
  type BillilgeCategoryFilterValue,
} from "@/features/billilge/constants/billilge";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeItem } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeItemListProps {
  category: BillilgeCategoryFilterValue;
  onRentRequest: (item: BillilgeItem) => void;
}

// 대여 탭의 물품 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 BillilgeListScreen의
// Suspense가 BillilgeListSkeleton을 보여준다. 대여 시트를 여는 동작은 Screen이 콜백으로 넘긴다.
function BillilgeItemList({ category, onRentRequest }: BillilgeItemListProps) {
  const { data: items } = useSuspenseQuery(billilgeQueries.items());

  return (
    <div className="flex flex-col gap-2 px-5 pb-4">
      {items
        .filter(
          (item) =>
            category === BILLILGE_ALL_CATEGORIES || item.category === category,
        )
        .map((item) => (
          <BillilgeItemCard
            icon={item.imageUrl}
            itemName={item.name}
            key={item.itemId}
            onRentRequest={() => onRentRequest(item)}
            subtitle={`수량 ${item.count}`}
          />
        ))}
    </div>
  );
}

export default BillilgeItemList;
