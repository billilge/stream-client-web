import { useSuspenseQuery } from "@tanstack/react-query";

import { feeQueries } from "@/entities/fee/feeApi";
import FeePaymentCard from "@/features/fee/components/FeePaymentCard";

interface FeePaymentListProps {
  /** 없으면 문의하기 버튼을 그리지 않는다(채널 주소가 아직 없을 때) */
  onContact?: () => void;
}

// 학기별 납부 내역을 최신순으로 쌓는다. Figma는 한 건만 그렸고, 여러 건이면 건 사이를 카드 간격보다 넓게(12px) 둔다.
function FeePaymentList({ onContact }: FeePaymentListProps) {
  const { data: payments } = useSuspenseQuery(feeQueries.payments());

  return (
    <div className="flex flex-col gap-2 px-5 pb-4">
      {payments.map((payment) => (
        <FeePaymentCard
          key={payment.id}
          onContact={onContact}
          payment={payment}
        />
      ))}
    </div>
  );
}

export default FeePaymentList;
