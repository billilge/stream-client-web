import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import {
  BILLILGE_ALL_CATEGORIES,
  type BillilgeCategoryFilterValue,
} from "@/features/billilge/constants/billilge";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeItem } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeItemListProps {
  category: BillilgeCategoryFilterValue;
  onRentRequest: (item: BillilgeItem) => void;
}

// 대여 탭의 물품 목록 데이터를 받아 그리는 부분. 데이터를 받는 동안은 BillilgeListScreen의
// Suspense가 BillilgeListSkeleton을 보여준다. 대여 시트를 여는 동작은 Screen이 콜백으로 넘긴다.
function BillilgeItemList({ category, onRentRequest }: BillilgeItemListProps) {
  // 카테고리는 서버가 걸러 준다 — 페이지로 나눠 받아서 받은 것만 거르면 다음 페이지의 물품이 빠진다
  const {
    data: items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSuspenseInfiniteQuery({
    ...billilgeQueries.items(
      category === BILLILGE_ALL_CATEGORIES ? null : category,
    ),
    select: (data) => data.pages.flatMap((page) => page.content),
  });
  const nextPageTriggerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchNextPageError,
    isFetchingNextPage,
  });

  return (
    <div className="pb-4">
      <div className="flex flex-col gap-2 px-5">
        {items.map((item) => (
          <BillilgeItemCard
            disabled={item.count === 0}
            icon={item.imageUrl}
            itemName={item.name}
            key={item.itemId}
            onRentRequest={() => onRentRequest(item)}
            subtitle={`수량 ${item.count}`}
          />
        ))}
      </div>
      {/* 카드 사이 gap이 붙지 않게 목록 밖에 둔다 */}
      <div ref={nextPageTriggerRef} />
    </div>
  );
}

export default BillilgeItemList;
