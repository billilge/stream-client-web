import { useSuspenseQuery } from "@tanstack/react-query";

import emptyEventsIllustration from "@/assets/icons/common/empty-events.svg";
import EmptyState from "@/components/ui/EmptyState";
import { feeQueries } from "@/entities/fee/feeApi";
import FeePaymentCard from "@/features/fee/components/FeePaymentCard";

interface FeePaymentListProps {
  /** 없으면 문의하기 버튼을 그리지 않는다(채널 주소가 아직 없을 때) */
  onContact?: () => void;
  onRepay: () => void;
}

// 서버가 학생의 최신 납부 요청 한 건만 주므로 카드도 한 장만 그린다.
function FeePaymentList({ onContact, onRepay }: FeePaymentListProps) {
  const { data: payment } = useSuspenseQuery({
    ...feeQueries.me(),
    // 한 번도 요청하지 않았으면(UNPAID) 그릴 내역이 없다
    select: (fee) =>
      fee.feeStatus === "UNPAID" ? null : { ...fee, feeStatus: fee.feeStatus },
  });

  // 홈은 미납이면 납부내역 대신 송금 플로우로 보내서, 주소로 바로 들어온 경우에만 보인다.
  // Figma에 없는 화면이라 다른 빈 화면(사물함 신청내역)과 같은 그림·간격을 쓴다.
  if (!payment) {
    return (
      <div className="flex justify-center pt-50">
        <EmptyState
          description="학생회비를 납부하면 여기서 확인할 수 있어요."
          illustration={emptyEventsIllustration}
          title="납부 내역이 없어요"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5 pb-4">
      <FeePaymentCard
        onContact={onContact}
        onRepay={onRepay}
        payment={payment}
      />
    </div>
  );
}

export default FeePaymentList;
