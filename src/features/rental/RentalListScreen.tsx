import {
  SegmentedControl,
  SegmentedControlItem,
  TopNavigation,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconBell, IconSearch } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { BottomNavValue } from "@/components/ui/BottomNav";
import ScreenLayout from "@/components/ui/ScreenLayout";
import RentalCategoryFilter from "@/features/rental/components/RentalCategoryFilter";
import RentalItemCard from "@/features/rental/components/RentalItemCard";
import { RENTAL_ITEMS } from "@/features/rental/constants/rentalItems";

// Figma: 빌릴게 (nodeId 1243:73331)
function RentalListScreen() {
  const [tab, setTab] = useState("rent");
  const [category, setCategory] = useState("전체");
  const [bottomNavValue, setBottomNavValue] =
    useState<BottomNavValue>("rental");
  const navigate = useNavigate();

  const handleBottomNavValueChange = (value: BottomNavValue) => {
    setBottomNavValue(value);
    if (value === "home") {
      navigate("/");
    }
  };

  return (
    <ScreenLayout
      bottomNavValue={bottomNavValue}
      header={
        // background 기본값(true)은 iOS 반투명 스타일이라 뒤 배경이 비쳐 보인다. Figma는 별도 배경 없이 화면 배경을 그대로 쓴다.
        <TopNavigation
          background={false}
          toolbar={
            <div className="px-5">
              <SegmentedControl onValueChange={setTab} size="small" value={tab}>
                <SegmentedControlItem value="rent">대여</SegmentedControlItem>
                <SegmentedControlItem value="return">반납</SegmentedControlItem>
              </SegmentedControl>
            </div>
          }
          trailingContent={
            <>
              <TopNavigationButton aria-label="검색" variant="icon">
                <IconSearch />
              </TopNavigationButton>
              <TopNavigationButton aria-label="알림" variant="icon">
                <IconBell />
              </TopNavigationButton>
            </>
          }
          variant="display"
        >
          빌릴게
        </TopNavigation>
      }
      onBottomNavValueChange={handleBottomNavValueChange}
    >
      <div className="px-5 py-4">
        <RentalCategoryFilter onChange={setCategory} value={category} />
      </div>

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
    </ScreenLayout>
  );
}

export default RentalListScreen;
