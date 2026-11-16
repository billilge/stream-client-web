import { useSuspenseQueries } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@wanteddev/wds";

import returnItemsEmpty from "@/assets/icons/billilge-empty/return-items.svg";
import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import BillilgeStatusBadge from "@/features/billilge/components/BillilgeStatusBadge";
import {
  BILLILGE_DELETED_ITEM_NAME,
  getReturnDueLabel,
} from "@/features/billilge/constants/billilge";
import HomeEmptyState from "@/features/home/components/HomeEmptyState";
import { formatDateTime } from "@/lib/date";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeHistoryListResponse } from "@/shared/entities/billilge/billilgeTypes";

const VISIBLE_COUNT = 2;

// 신청했지만 아직 받아 가지 않은 대여(대여 승인대기·수령대기) — 반납 필요 조회에는 없어서 대여 내역에서 고른다
function selectAwaitingPickup({ histories }: BillilgeHistoryListResponse) {
  return histories.filter(
    (history) => history.status === "PENDING" || history.status === "CONFIRMED",
  );
}

interface HomeRentalSectionProps {
  // 반납 신청 — 홈에서 바로 확인 모달을 띄운다
  onReturnRequest: (rentalHistoryId: number) => void;
  // 더보기 → 빌릴게 반납 탭
  onMore: () => void;
  // 빈 상태 → 빌릴게 대여 탭
  onBrowse: () => void;
}

// Figma: Rental Summary 2건 (nodeId 3147:146269), 3건 이상 (3147:146326), empty (3562:163925)
// 빌릴게 반납 탭과 같은 반납 필요 대여를 받아 그린다(홈 API는 반납 대기·확인을 나누지 않아 쓰지 않는다). 받는 동안은 HomeScreen의
// Suspense가 HomeRentalSkeleton을 보여준다.
// 반납 필요 대여 뒤에 아직 받아 가지 않은 대여도 붙인다 — Figma에 이 상태가 없어서, 반납 기한 대신 대여 예정 시각을
// 보조 문구로 쓰고 버튼 대신 상태 뱃지를 둔다. 반납 기한이 있는 대여가 더 급해서 먼저 보인다.
function HomeRentalSection({
  onReturnRequest,
  onMore,
  onBrowse,
}: HomeRentalSectionProps) {
  // 두 조회를 따로 기다리지 않게(요청이 줄줄이 이어지지 않게) 한 번에 같이 받는다 — 빌릴게 반납 탭과 같은 조회라 캐시도 같이 쓴다
  const [
    {
      data: { rentalHistories: rentals },
    },
    { data: awaitingPickup },
  ] = useSuspenseQueries({
    queries: [
      billilgeQueries.returnRequired(),
      { ...billilgeQueries.histories(), select: selectAwaitingPickup },
    ],
  });

  const totalCount = rentals.length + awaitingPickup.length;

  if (totalCount === 0) {
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

  const visibleRentals = rentals.slice(0, VISIBLE_COUNT);
  const visibleAwaitingPickup = awaitingPickup.slice(
    0,
    VISIBLE_COUNT - visibleRentals.length,
  );
  const hiddenCount = totalCount - VISIBLE_COUNT;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="label2"
        weight="medium"
      >
        대여 중인 물품 · {totalCount}건
      </Typography>
      <div className="flex flex-col gap-4">
        {visibleRentals.map((rental) => {
          const due = getReturnDueLabel(rental.dueAt);
          return (
            <BillilgeItemCard
              actionLabel="반납 신청"
              icon={rental.itemImageUrl}
              itemName={rental.itemName ?? BILLILGE_DELETED_ITEM_NAME}
              key={rental.rentalHistoryId}
              onRentRequest={() => onReturnRequest(rental.rentalHistoryId)}
              subtitle={due.text}
              subtitleTone={due.isOverdue ? "negative" : "normal"}
              surface={false}
              // 빌릴게 반납 탭과 같다 — 이미 반납을 신청한 대여는 버튼 대신 상태를 보여 준다
              trailingBadge={
                rental.status === "RENTAL" ? undefined : (
                  <BillilgeStatusBadge status={rental.status} />
                )
              }
            />
          );
        })}
        {visibleAwaitingPickup.map((rental) => (
          <BillilgeItemCard
            icon={rental.itemImageUrl}
            itemName={rental.itemName ?? BILLILGE_DELETED_ITEM_NAME}
            key={rental.rentalHistoryId}
            subtitle={
              rental.rentAt
                ? `${formatDateTime(rental.rentAt)} 대여 예정`
                : "대여 예정"
            }
            surface={false}
            trailingBadge={<BillilgeStatusBadge status={rental.status} />}
          />
        ))}
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
