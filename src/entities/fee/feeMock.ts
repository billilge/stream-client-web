import type { FeePayment } from "@/entities/fee/types";

const TITLE = "소프트웨어융합대학 학생회비";

// Figma: 학생회비 납부내역 납부확인중 (nodeId 3147:147860), 확인필요 (3147:147879), 납부완료 (3147:147841)
const CHECKING: FeePayment = {
  amount: 150000,
  confirmedAt: null,
  id: "2026-2",
  paidAt: "2026-09-04T11:49",
  status: "checking",
  title: TITLE,
};

const NEEDS_CHECK: FeePayment = {
  amount: null,
  confirmedAt: null,
  id: "2026-2",
  paidAt: "2026-09-04T11:49",
  reviewNote:
    "입금자 정보를 확인하지 못했어요. 문제가 있을 경우 학생회에 문의해 주세요.",
  status: "needs-check",
  title: TITLE,
};

const PAID: FeePayment = {
  amount: 150000,
  confirmedAt: "2026-09-05T13:30",
  id: "2026-2",
  paidAt: "2026-09-04T11:49",
  status: "paid",
  title: TITLE,
};

// 여러 학기 내역이 쌓인 경우 — 최신순
const MULTIPLE: FeePayment[] = [
  NEEDS_CHECK,
  {
    ...PAID,
    confirmedAt: "2026-03-05T13:30",
    id: "2026-1",
    paidAt: "2026-03-04T11:49",
  },
];

// 상태를 바꿔 납부내역 화면을 확인한다
type FeeMockState = "checking" | "needs-check" | "paid" | "multiple";
const FEE_MOCK_STATE: FeeMockState = "multiple";

const FEE_PAYMENTS: Record<FeeMockState, FeePayment[]> = {
  checking: [CHECKING],
  multiple: MULTIPLE,
  "needs-check": [NEEDS_CHECK],
  paid: [PAID],
};

export const FEE_PAYMENTS_MOCK = FEE_PAYMENTS[FEE_MOCK_STATE];
