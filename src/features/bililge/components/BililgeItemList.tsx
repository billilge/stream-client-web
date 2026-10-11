import { use } from "react";

import { fetchBililgeItems } from "@/entities/bililge/bililgeApi";
import type { BililgeItem } from "@/entities/bililge/types";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";

interface BililgeItemListProps {
  // "전체"는 필터 없음, 그 외는 BililgeCategory 값(BililgeCategoryFilter 칩 값)
  category: string;
  onRentRequest: (item: BililgeItem) => void;
}

// 대여 탭의 물품 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 BililgeListScreen의
// Suspense가 BililgeListSkeleton을 보여준다. 대여 시트를 여는 동작은 Screen이 콜백으로 넘긴다.
function BililgeItemList({ category, onRentRequest }: BililgeItemListProps) {
  const items = use(fetchBililgeItems());

  return (
    <div className="flex flex-col gap-2 px-5 pb-4">
      {items
        .filter((item) => category === "전체" || item.category === category)
        .map((item) => (
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
