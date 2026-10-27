import { Button, Typography } from "@wanteddev/wds";

import StatusSummaryCard from "@/components/ui/StatusSummaryCard";
import type { FeePayment } from "@/entities/fee/types";
import { FEE_STATUS_BADGES } from "@/features/fee/constants/fee";
import { formatDateTime } from "@/lib/date";

interface FeePaymentCardProps {
  payment: FeePayment;
  /** 없으면 문의하기 버튼을 그리지 않는다(채널 주소가 아직 없을 때) */
  onContact?: () => void;
}

function formatAmount(value: number | null) {
  return value === null ? "-" : `${value.toLocaleString("ko-KR")}원`;
}

// Figma: 학생회비 납부내역 납부확인중 (nodeId 3147:147860), 확인필요 (3147:147879), 납부완료 (3147:147841)
// 납부 요약은 공용 StatusSummaryCard이고, 그 아래에 확인필요일 때만 학생회 확인 내용 카드(학생회비 로컬)가 붙는다.
// 행 간격은 Figma(8px)가 아니라 다른 요약 카드와 같은 6px다 — Figma 쪽 실수로 보고 맞췄다(#120).
function FeePaymentCard({ payment, onContact }: FeePaymentCardProps) {
  const rows = [
    { label: "납부금액", value: formatAmount(payment.amount) },
    { label: "납부일시", value: formatDateTime(payment.paidAt) },
    {
      label: "확인일시",
      value: payment.confirmedAt ? formatDateTime(payment.confirmedAt) : "-",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <StatusSummaryCard
        badge={FEE_STATUS_BADGES[payment.status]}
        rows={rows}
        title={payment.title}
      />

      {payment.status === "needs-check" && (
        <div className="flex flex-col gap-3 rounded-xl bg-background-normal p-4">
          <div className="flex flex-col gap-2">
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="medium"
            >
              학생회 확인 내용
            </Typography>
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="label1-reading"
              weight="medium"
            >
              {payment.reviewNote}
            </Typography>
          </div>
          {onContact && (
            <Button
              color="assistive"
              fullWidth
              onClick={onContact}
              size="medium"
              variant="outlined"
            >
              문의하기
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default FeePaymentCard;
