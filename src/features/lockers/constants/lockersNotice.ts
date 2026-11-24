import applyPeriodIcon from "@/assets/icons/lockers/apply-period.svg";
import noChangeIcon from "@/assets/icons/lockers/no-change.svg";
import usagePeriodIcon from "@/assets/icons/lockers/usage-period.svg";
import { formatDate } from "@/lib/date";
import type { LockerPeriodResponse } from "@/shared/entities/lockers/lockersTypes";

export interface LockersNoticeItem {
  icon: string;
  label: string;
  value: string;
}

export interface LockersNotice {
  items: LockersNoticeItem[];
  isApplyPeriod: boolean;
}

// 위 일러스트 3개는 Figma export가 캔버스·섹션 배경까지 같이 구워 넣어서(42px 회색 네모)
// 아이콘 그룹만 남기고 걷어낸 SVG다 — 다시 받으면 같은 정리가 필요하다.
const NO_CHANGE_ITEM: LockersNoticeItem = {
  icon: noChangeIcon,
  label: "변경/취소 불가",
  value: "신청 후에는 변경하거나 취소할 수 없어요.",
};

function formatPeriod(start: string, end: string) {
  const toDate = (value: string) =>
    formatDate(value.slice(0, 10), { weekday: true });
  return `${toDate(start)} - ${toDate(end)}`;
}

export function toLockersNotice(period: LockerPeriodResponse): LockersNotice {
  if (!period) {
    return { isApplyPeriod: false, items: [NO_CHANGE_ITEM] };
  }
  return {
    isApplyPeriod: period.status === "OPEN",
    items: [
      {
        icon: usagePeriodIcon,
        label: "사물함 이용 기간",
        value: formatPeriod(period.usageStartDate, period.usageEndDate),
      },
      NO_CHANGE_ITEM,
      {
        icon: applyPeriodIcon,
        label: "신청기간",
        value: formatPeriod(period.applyStartAt, period.applyEndAt),
      },
    ],
  };
}
