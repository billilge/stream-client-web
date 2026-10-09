import { Button, ContentBadge, Typography } from "@wanteddev/wds";

import type { FeePayment } from "@/entities/fee/types";
import { FEE_STATUS_BADGES } from "@/features/fee/constants/fee";

interface FeePaymentCardProps {
  payment: FeePayment;
  onContact: () => void;
}

// "2026-09-04T11:49" → "2026.09.04 11:49"
function formatDateTime(value: string | null) {
  return value ? value.replace("T", " ").replaceAll("-", ".") : "-";
}

function formatAmount(value: number | null) {
  return value === null ? "-" : `${value.toLocaleString("ko-KR")}원`;
}

// Figma: 학생회비 납부내역 납부확인중 (nodeId 3147:147860), 확인필요 (3147:147879), 납부완료 (3147:147841)
// 납부 카드 아래에, 확인필요일 때만 학생회 확인 내용 카드가 붙는다. 둘 다 Stream 로컬 카드다.
function FeePaymentCard({ payment, onContact }: FeePaymentCardProps) {
  const badge = FEE_STATUS_BADGES[payment.status];
  const rows = [
    { label: "납부금액", value: formatAmount(payment.amount) },
    { label: "납부일시", value: formatDateTime(payment.paidAt) },
    { label: "확인일시", value: formatDateTime(payment.confirmedAt) },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start gap-2 rounded-xl bg-background-normal p-4">
        <ContentBadge
          accentColor={`semantic.accent.foreground.${badge.color}`}
          color="accent"
          size="small"
          variant="solid"
        >
          {badge.label}
        </ContentBadge>
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          {payment.title}
        </Typography>
        {rows.map((row) => (
          <div className="flex gap-2" key={row.label}>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {row.label}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.neutral"
              variant="label2"
              weight="regular"
            >
              {row.value}
            </Typography>
          </div>
        ))}
      </div>

      {payment.status === "needs-check" && payment.reviewNote && (
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
          <Button
            color="assistive"
            fullWidth
            onClick={onContact}
            size="medium"
            variant="outlined"
          >
            문의하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default FeePaymentCard;
