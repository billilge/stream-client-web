import { Button, Divider, Typography } from "@wanteddev/wds";

import returnItemsEmpty from "@/assets/icons/bililge-empty/return-items.svg";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import type { HomeRental } from "@/features/home/constants/homeMock";

const VISIBLE_COUNT = 2;

// Figma: Rental Summary 2건 (nodeId 3147:146269), 3건 이상 (3147:146326), empty (3562:163925)
function HomeRentalSection({ rentals }: { rentals: HomeRental[] }) {
  if (rentals.length === 0) {
    return (
      <HomeEmptyState
        action={
          <Button color="assistive" size="small" variant="solid">
            대여하러 가기
          </Button>
        }
        illustration={<img alt="" className="w-8.75" src={returnItemsEmpty} />}
        message="대여한 물품이 없어요"
      />
    );
  }

  const hiddenCount = rentals.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="medium"
      >
        대여 중인 물품 · {rentals.length}건
      </Typography>
      <div className="flex flex-col gap-4">
        {rentals.slice(0, VISIBLE_COUNT).map((rental) => (
          <BililgeItemCard
            actionLabel="반납 신청"
            icon={rental.icon}
            itemName={rental.name}
            key={rental.id}
            subtitle={
              rental.hoursUntilDue < 0
                ? `반납 기한이 ${-rental.hoursUntilDue}시간 지났어요`
                : `반납까지 ${rental.hoursUntilDue}시간`
            }
            subtitleTone={rental.hoursUntilDue < 0 ? "negative" : "normal"}
            surface={false}
          />
        ))}
      </div>
      {hiddenCount > 0 && (
        <>
          <Divider color="semantic.line.normal.alternative" />
          <button type="button">
            <Typography
              align="center"
              as="span"
              color="semantic.primary.normal"
              display="block"
              variant="label1"
              weight="regular"
            >
              {hiddenCount}건 더보기
            </Typography>
          </button>
        </>
      )}
    </div>
  );
}

export default HomeRentalSection;
