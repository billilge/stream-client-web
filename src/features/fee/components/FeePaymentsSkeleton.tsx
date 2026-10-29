import { StatusSummaryCardSkeleton } from "@/components/ui/StatusSummaryCard";

// 납부내역을 받는 동안 보이는 스켈레톤 — 납부 카드(배지 + 제목 + 3줄) 배치만 따른다.
function FeePaymentsSkeleton() {
  return (
    <div className="flex flex-col px-5">
      <StatusSummaryCardSkeleton
        rowWidths={["50%", "60%", "50%"]}
        titleWidth="70%"
      />
    </div>
  );
}

export default FeePaymentsSkeleton;
