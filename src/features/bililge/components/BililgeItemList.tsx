import { use } from "react";

import { fetchBililgeItems } from "@/entities/bililge/bililgeApi";
import type { BililgeItem } from "@/entities/bililge/types";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";

interface BililgeItemListProps {
  onRentRequest: (item: BililgeItem) => void;
}

// 대여 탭의 물품 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 BililgeListScreen의
// Suspense가 BililgeListSkeleton을 보여준다. 대여 시트를 여는 동작은 Screen이 콜백으로 넘긴다.
function BililgeItemList({ onRentRequest }: BililgeItemListProps) {
  const items = use(fetchBililgeItems());

  return (
    <div className="flex flex-col gap-2 px-5 pb-4">
      {items.map((item) => (
        <BililgeItemCard
          icon={item.icon}
          itemName={item.name}
          key={item.id}
          onRentRequest={() => onRentRequest(item)}
          subtitle={`수량 ${item.quantity}`}
        />
      ))}
    </div>
  );
}

export default BililgeItemList;
