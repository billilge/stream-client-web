import { SegmentedControl, SegmentedControlItem } from "@wanteddev/wds";
import { useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import RentalCategoryFilter from "@/features/rental/components/RentalCategoryFilter";
import RentalItemCard from "@/features/rental/components/RentalItemCard";
import { RENTAL_ITEMS } from "@/features/rental/constants/rentalItems";

// Figma: 빌릴게 (nodeId 1243:73331)
function RentalListScreen() {
  const [tab, setTab] = useState("rent");
  const [category, setCategory] = useState("전체");

  useScreenHeader(<ScreenHeader title="빌릴게" />);

  return (
    <div className="flex h-full flex-col">
      {/* 대여/반납 토글 + 카테고리 필터는 화면마다 값·동작이 달라 헤더가 아니라 화면이 직접 그린다.
          목록만 스크롤되도록 여기는 고정(shrink-0)한다. */}
      <div className="shrink-0 px-5 pt-4">
        <SegmentedControl onValueChange={setTab} size="small" value={tab}>
          <SegmentedControlItem value="rent">대여</SegmentedControlItem>
          <SegmentedControlItem value="return">반납</SegmentedControlItem>
        </SegmentedControl>
      </div>

      <div className="shrink-0 px-5 py-4">
        <RentalCategoryFilter onChange={setCategory} value={category} />
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "rent" ? (
          <div className="flex flex-col gap-2 px-5 pb-4">
            {RENTAL_ITEMS.map((item) => (
              <RentalItemCard
                icon={item.icon}
                itemName={item.name}
                key={item.id}
                quantity={item.quantity}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20 text-label-alternative text-sm">
            반납 화면은 아직 준비 중이에요
          </div>
        )}
      </div>
    </div>
  );
}

export default RentalListScreen;
