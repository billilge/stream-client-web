import { Button, Divider, Typography } from "@wanteddev/wds";
import { Fragment, useEffect, useRef, useState } from "react";

import rentalHistoryEmptyIllustration from "@/assets/icons/bililge-empty/rental-history.svg";
import returnItemsEmptyIllustration from "@/assets/icons/bililge-empty/return-items.svg";
import BililgeEmptyState from "@/features/bililge/components/BililgeEmptyState";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import BililgeRentalHistoryEntry from "@/features/bililge/components/BililgeRentalHistoryEntry";
import BililgeReturnConfirmModal from "@/features/bililge/components/BililgeReturnConfirmModal";
import BililgeReturnToast from "@/features/bililge/components/BililgeReturnToast";
import {
  BILILGE_RENTAL_HISTORY,
  BILILGE_RETURN_ITEMS,
} from "@/features/bililge/constants/bililgeReturns";

// 토스트 자동 닫힘 시간 — Figma엔 지속시간이 없어서 WDS Toast의 duration="short" 기본값과
// 맞췄다(node_modules/@wanteddev/wds/dist/components/toast/index.mjs, short=3000ms).
const TOAST_DURATION_MS = 3000;

interface BililgeReturnSectionProps {
  onBrowseRentals?: () => void;
}

// Figma: 빌릴게 반납 화면 Content (nodeId 1133:49978, 빈 상태는 1410:55628) — 반납이 필요한 물품 +
// 대여 내역 두 섹션. 대여 탭과 달리 카테고리 필터 행이 없어서 BililgeListScreen이 이 탭일 때는
// 필터를 안 그린다.
//
// "반납 신청" 버튼 → 확인 모달(1133:49993) → "신청하기"로 확정하면 완료 토스트(1133:50015)가
// 뜬다("수정"은 모달만 닫는다). 실 백엔드 연동 전이라 신청 자체는 로컬 상태만 바꾸고(토스트만
// 보여줌) 반납 대상 물품 목록·대여 내역은 그대로 둔다 — API가 붙으면 이 부분만 교체하면 된다.
//
// 하단 패딩을 넣지 않는다 — Content(1133:49978) 높이(542)가 두 섹션 높이(196+314)와 gap(32)의
// 합과 정확히 같아서 Figma엔 하단 여백이 0이다. 대여 탭 목록의 pb-4는 앱 전역 스크롤 여백
// 컨벤션이라 그대로 두지만, 반납 화면은 이번에 새로 붙이는 값이라 Figma 그대로 맞춘다.
function BililgeReturnSection({ onBrowseRentals }: BililgeReturnSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  // 토스트가 떠 있는 동안 다시 확인해도 스크린리더가 재안내하도록, 확인마다 값을 바꿔 메시지
  // 텍스트를 새로 마운트한다(BililgeReturnToast의 messageKey로 전달).
  const [toastToken, setToastToken] = useState(0);
  // 타이머를 이펙트가 아니라 ref로 직접 관리한다 — 토스트가 이미 떠 있는 채로 다시 확인하면
  // "새 확인 시점부터 3초"가 되도록, 기존 타이머를 지우고 새로 시작해야 하기 때문이다.
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleConfirm = () => {
    setConfirmOpen(false);
    setToastOpen(true);
    setToastToken((token) => token + 1);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(
      () => setToastOpen(false),
      TOAST_DURATION_MS,
    );
  };

  return (
    <div className="flex flex-col gap-8 px-5 pt-6">
      <div className="flex flex-col gap-3">
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="headline2"
          weight="bold"
        >
          반납이 필요한 물품
        </Typography>
        {BILILGE_RETURN_ITEMS.length > 0 ? (
          <div className="flex flex-col gap-3">
            {BILILGE_RETURN_ITEMS.map((item) => (
              <BililgeItemCard
                actionLabel="반납 신청"
                icon={item.icon}
                itemName={item.name}
                key={item.id}
                onRentRequest={() => setConfirmOpen(true)}
                subtitle={`반납까지 ${item.hoursUntilDue}시간`}
              />
            ))}
          </div>
        ) : (
          <BililgeEmptyState
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
        {BILILGE_RENTAL_HISTORY.length > 0 ? (
          <div className="flex flex-col gap-4 rounded-xl bg-background-normal p-4">
            {BILILGE_RENTAL_HISTORY.map((entry, index) => (
              <Fragment key={entry.id}>
                {index > 0 && (
                  <Divider color="semantic.line.normal.alternative" />
                )}
                <BililgeRentalHistoryEntry
                  icon={entry.icon}
                  itemName={entry.name}
                  rentedAt={entry.rentedAt}
                  returnedAt={entry.returnedAt}
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <BililgeEmptyState
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

      <BililgeReturnConfirmModal
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        open={confirmOpen}
      />
      <BililgeReturnToast messageKey={toastToken} open={toastOpen} />
    </div>
  );
}

export default BililgeReturnSection;
