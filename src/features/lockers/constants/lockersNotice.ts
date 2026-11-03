import applyPeriodIcon from "@/assets/icons/lockers/apply-period.svg";
import onePerPersonIcon from "@/assets/icons/lockers/one-per-person.svg";
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
const ONE_PER_PERSON_ITEM: LockersNoticeItem = {
  icon: onePerPersonIcon,
  label: "중복 신청 불가",
  value: "1인당 1개의 사물함만 신청 가능해요.",
};

function formatPeriod(start: string, end: string) {
  const toDate = (value: string) =>
    formatDate(value.slice(0, 10), { weekday: true });
  return `${toDate(start)} - ${toDate(end)}`;
}

export function toLockersNotice(period: LockerPeriodResponse): LockersNotice {
  if (!period) {
    return { isApplyPeriod: false, items: [ONE_PER_PERSON_ITEM] };
  }
  return {
    isApplyPeriod: period.status === "OPEN",
    items: [
      {
        icon: usagePeriodIcon,
        label: "사물함 이용 기간",
        value: formatPeriod(period.usageStartDate, period.usageEndDate),
      },
      ONE_PER_PERSON_ITEM,
      {
        icon: applyPeriodIcon,
        label: "신청기간",
        value: formatPeriod(period.applyStartAt, period.applyEndAt),
      },
    ],
  };
}
