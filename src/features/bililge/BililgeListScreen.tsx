import { SegmentedControl, SegmentedControlItem } from "@wanteddev/wds";
import { startTransition, useState } from "react";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import BililgeCategoryFilter from "@/features/bililge/components/BililgeCategoryFilter";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import BililgeRentalSheet from "@/features/bililge/components/BililgeRentalSheet";
import {
  BILILGE_ITEMS,
  type BililgeItem,
} from "@/features/bililge/constants/bililgeItems";

// Figma: 빌릴게 (nodeId 1243:73331)
function BililgeListScreen() {
  const [tab, setTab] = useState("rent");
  const [category, setCategory] = useState("전체");
  const [rentalItem, setRentalItem] = useState<BililgeItem | null>(null);
  const [rentalSheetOpen, setRentalSheetOpen] = useState(false);

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
        <BililgeCategoryFilter onChange={setCategory} value={category} />
      </div>

      <div className="scrollbar-hidden flex-1 overflow-y-auto">
        {tab === "rent" ? (
          <div className="flex flex-col gap-2 px-5 pb-4">
            {BILILGE_ITEMS.map((item) => (
              <BililgeItemCard
                icon={item.icon}
                itemName={item.name}
                key={item.id}
                onRentRequest={() => {
                  // 바텀시트를 여는 것(슬라이드 애니메이션)은 즉시 반영하고, 그 안의 휠
                  // 피커(특히 분 60개) 마운트처럼 무거운 작업은 startTransition으로 낮은
                  // 우선순위로 미뤄서 첫 프레임이 버벅이지 않게 한다 — 처음 열 때만 해당하고,
                  // rentalItem은 닫아도 null로 안 돌아가서 두 번째부터는 이 마운트 비용 자체가 없다.
                  setRentalSheetOpen(true);
                  startTransition(() => {
                    setRentalItem(item);
                  });
                }}
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

      <BililgeRentalSheet
        item={rentalItem}
        onClose={() => setRentalSheetOpen(false)}
        open={rentalSheetOpen}
      />
    </div>
  );
}

export default BililgeListScreen;
