import { useSuspenseQueries } from "@tanstack/react-query";
import { Button, Divider, Typography } from "@wanteddev/wds";
import { Fragment } from "react";

import rentalHistoryEmptyIllustration from "@/assets/icons/billilge-empty/rental-history.svg";
import returnItemsEmptyIllustration from "@/assets/icons/billilge-empty/return-items.svg";
import BillilgeEmptyState from "@/features/billilge/components/BillilgeEmptyState";
import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import BillilgeRentalHistoryEntry from "@/features/billilge/components/BillilgeRentalHistoryEntry";
import { BILLILGE_DELETED_ITEM_NAME } from "@/features/billilge/constants/billilge";
import { useBillilgeReturnRequest } from "@/features/billilge/hooks/useBillilgeReturnRequest";
import { formatDateTime, getHoursUntil } from "@/lib/date";
import { billilgeQueries } from "@/shared/entities/billilge/billilgeQueries";

interface BillilgeReturnSectionProps {
  onBrowseRentals?: () => void;
}

// Figma: 빌릴게 반납 화면 Content (nodeId 1133:49978, 빈 상태는 1410:55628) — 반납이 필요한 물품 +
// 대여 내역 두 섹션. 대여 탭과 달리 카테고리 필터 행이 없어서 BillilgeListScreen이 이 탭일 때는
// 필터를 안 그린다. 두 조회를 받는 동안은 BillilgeListScreen의 Suspense가 BillilgeReturnSkeleton을 보여준다.
//
// "반납 신청" 버튼 → 확인 모달(1133:49993) → "신청하기"로 확정하면 완료 토스트(1133:50015)가
// 뜬다("닫기"는 모달만 닫는다).
//
// 하단 패딩을 넣지 않는다 — Content(1133:49978) 높이(542)가 두 섹션 높이(196+314)와 gap(32)의
// 합과 정확히 같아서 Figma엔 하단 여백이 0이다. 대여 탭 목록의 pb-4는 앱 전역 스크롤 여백
// 컨벤션이라 그대로 두지만, 반납 화면은 이번에 새로 붙이는 값이라 Figma 그대로 맞춘다.
function BillilgeReturnSection({
  onBrowseRentals,
}: BillilgeReturnSectionProps) {
  // 두 조회를 따로 기다리지 않게(요청이 줄줄이 이어지지 않게) 한 번에 같이 받는다
  const [
    {
      data: { rentalHistories: returnItems },
    },
    {
      data: { histories },
    },
  ] = useSuspenseQueries({
    queries: [billilgeQueries.returnRequired(), billilgeQueries.histories()],
  });
  const { openReturnRequest, returnRequestDialogs } =
    useBillilgeReturnRequest();

  return (
    <div className="flex flex-col gap-8 px-5 pt-7">
      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          반납이 필요한 물품
        </Typography>
        {returnItems.length > 0 ? (
          <div className="flex flex-col gap-2">
            {returnItems.map((item) => {
              const hoursUntilDue = getHoursUntil(item.dueAt);
              return (
                <BillilgeItemCard
                  actionLabel="반납 신청"
                  icon={item.itemImageUrl}
                  itemName={item.itemName ?? BILLILGE_DELETED_ITEM_NAME}
                  key={item.rentalHistoryId}
                  onRentRequest={openReturnRequest}
                  // 기한이 지나면 홈 대여 현황(3147:146331)처럼 빨간 문구로 바뀐다
                  subtitle={
                    hoursUntilDue < 0
                      ? `반납 기한이 ${-hoursUntilDue}시간 지났어요`
                      : `반납까지 ${hoursUntilDue}시간`
                  }
                  subtitleTone={hoursUntilDue < 0 ? "negative" : "normal"}
                />
              );
            })}
          </div>
        ) : (
          <BillilgeEmptyState
            description="반납할 물품이 생기면 여기에 표시돼요"
            illustration={returnItemsEmptyIllustration}
            title="아직 반납할 물품이 없어요"
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          대여 내역
        </Typography>
        {histories.length > 0 ? (
          <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
            {histories.map((history, index) => (
              <Fragment key={history.rentalHistoryId}>
                {index > 0 && (
                  <Divider color="semantic.line.normal.alternative" />
                )}
                <BillilgeRentalHistoryEntry
                  icon={history.itemImageUrl}
                  itemName={history.itemName ?? BILLILGE_DELETED_ITEM_NAME}
                  rentedAt={
                    history.rentAt ? formatDateTime(history.rentAt) : "-"
                  }
                  returnedAt={
                    history.returnedAt
                      ? formatDateTime(history.returnedAt)
                      : "-"
                  }
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <BillilgeEmptyState
            action={
              <Button
                color="assistive"
                onClick={onBrowseRentals}
                size="small"
                variant="solid"
              >
                대여 신청하기
              </Button>
            }
            description="필요한 물품을 대여해 보세요"
            illustration={rentalHistoryEmptyIllustration}
            title="아직 대여 내역이 없어요"
          />
        )}
      </div>

      {returnRequestDialogs}
    </div>
  );
}

export default BillilgeReturnSection;
