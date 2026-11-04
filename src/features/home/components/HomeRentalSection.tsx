import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@wanteddev/wds";

import returnItemsEmpty from "@/assets/icons/billilge-empty/return-items.svg";
import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import { BILLILGE_DELETED_ITEM_NAME } from "@/features/billilge/constants/billilge";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import { getHoursUntil } from "@/lib/date";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";

const VISIBLE_COUNT = 2;

interface HomeRentalSectionProps {
  // 반납 신청 — 홈에서 바로 확인 모달을 띄운다
  onReturnRequest: (rentalHistoryId: number) => void;
  // 더보기 → 빌릴게 반납 탭
  onMore: () => void;
  // 빈 상태 → 빌릴게 대여 탭
  onBrowse: () => void;
}

// Figma: Rental Summary 2건 (nodeId 3147:146269), 3건 이상 (3147:146326), empty (3562:163925)
// 빌릴게 반납 탭과 같은 반납 필요 대여를 받아 그린다(홈 API가 생기면 출처만 바꾼다). 받는 동안은 HomeScreen의
// Suspense가 HomeRentalSkeleton을 보여준다.
function HomeRentalSection({
  onReturnRequest,
  onMore,
  onBrowse,
}: HomeRentalSectionProps) {
  const {
    data: { rentalHistories: rentals },
  } = useSuspenseQuery(billilgeQueries.returnRequired());

  if (rentals.length === 0) {
    return (
      <HomeEmptyState
        action={
          <Button
            color="assistive"
            onClick={onBrowse}
            size="small"
            variant="solid"
          >
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
        {rentals.slice(0, VISIBLE_COUNT).map((rental) => {
          const hoursUntilDue = getHoursUntil(rental.dueAt);
          return (
            <BillilgeItemCard
              actionLabel="반납 신청"
              icon={rental.itemImageUrl}
              itemName={rental.itemName ?? BILLILGE_DELETED_ITEM_NAME}
              key={rental.rentalHistoryId}
              onRentRequest={() => onReturnRequest(rental.rentalHistoryId)}
              subtitle={
                hoursUntilDue < 0
                  ? `반납 기한이 ${-hoursUntilDue}시간 지났어요`
                  : `반납까지 ${hoursUntilDue}시간`
              }
              subtitleTone={hoursUntilDue < 0 ? "negative" : "normal"}
              surface={false}
            />
          );
        })}
      </div>
      {hiddenCount > 0 && (
        <>
          <Divider color="semantic.line.normal.alternative" />
          <button onClick={onMore} type="button">
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
