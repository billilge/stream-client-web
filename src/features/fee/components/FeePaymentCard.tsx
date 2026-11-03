import { Button, Typography } from "@wanteddev/wds";

import StatusSummaryCard from "@/components/ui/StatusSummaryCard";
import type { FeePaymentStatus, FeeResponse } from "@/entities/fee/types";
import { FEE_STATUS_BADGES, FEE_TITLE } from "@/features/fee/constants/fee";
import { formatDateTime } from "@/lib/date";

interface FeePaymentCardProps {
  /** 납부를 요청한 적이 있는 응답 — 미납(UNPAID)은 그릴 내역이 없어서 목록이 거른다 */
  payment: FeeResponse & { feeStatus: FeePaymentStatus };
  /** 없으면 문의하기 버튼을 그리지 않는다(채널 주소가 아직 없을 때) */
  onContact?: () => void;
  /** 확인필요일 때 "다시 납부하기" — 송금 플로우를 처음(남은 학기 수)부터 다시 탄다 */
  onRepay: () => void;
}

function formatAmount(value: number | null) {
  return value === null ? "-" : `${value.toLocaleString("ko-KR")}원`;
}

// Figma: 학생회비 납부내역 납부확인중 (nodeId 3147:147860), 확인필요 (3147:147879), 납부완료 (3147:147841)
// 납부 요약은 공용 StatusSummaryCard이고, 그 아래에 확인필요일 때만 학생회 확인 내용 카드(학생회비 로컬)가 붙는다.
// 행 간격은 Figma(8px)가 아니라 다른 요약 카드와 같은 6px다 — Figma 쪽 실수로 보고 맞췄다(#120).
// "다시 납부하기"는 Figma에 없는 버튼이라 같은 카드의 "문의하기"와 같은 모양으로 그 아래에 둔다.
function FeePaymentCard({ payment, onContact, onRepay }: FeePaymentCardProps) {
  // 확인필요면 서버가 금액을 비워서 준다(다시 낼 때 학기 수부터 새로 받기 때문) — 그때는 "-"다
  const rows = [
    { label: "납부금액", value: formatAmount(payment.transferAmount) },
    {
      label: "납부일시",
      value: payment.requestedAt ? formatDateTime(payment.requestedAt) : "-",
    },
    {
      label: "확인일시",
      value: payment.confirmedAt ? formatDateTime(payment.confirmedAt) : "-",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <StatusSummaryCard
        badge={FEE_STATUS_BADGES[payment.feeStatus]}
        rows={rows}
        title={FEE_TITLE}
      />

      {payment.feeStatus === "REJECTED" && (
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
              {payment.rejectReason}
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
          <Button
            color="assistive"
            fullWidth
            onClick={onRepay}
            size="medium"
            variant="outlined"
          >
            다시 납부하기
          </Button>
        </div>
      )}
    </div>
  );
}

export default FeePaymentCard;
