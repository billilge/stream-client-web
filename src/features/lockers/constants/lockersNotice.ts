import applyPeriodIcon from "@/assets/icons/lockers/apply-period.svg";
import onePerPersonIcon from "@/assets/icons/lockers/one-per-person.svg";
import usagePeriodIcon from "@/assets/icons/lockers/usage-period.svg";

// 지금이 신청 기간인지. 실제 기간 API가 붙기 전까지 이 값을 바꿔서 두 상태를 확인한다
// (행사 신청 플로우의 목업 제출 결과와 같은 방식).
export const IS_LOCKERS_APPLY_PERIOD = true;

export interface LockersNoticeItem {
  icon: string;
  label: string;
  value: string;
}

// Figma: 사물함 신청 전 유의사항 Notice Items (nodeId 1737:218314)의 내용을 그대로 옮긴 목데이터.
// 이용 기간·신청 기간 API가 붙으면 그 값으로 바뀔 자리다.
// 위 일러스트 3개는 Figma export가 캔버스·섹션 배경까지 같이 구워 넣어서(42px 회색 네모)
// 아이콘 그룹만 남기고 걷어낸 SVG다 — 다시 받으면 같은 정리가 필요하다.
export const LOCKERS_NOTICE_ITEMS: LockersNoticeItem[] = [
  {
    icon: usagePeriodIcon,
    label: "사물함 이용 기간",
    value: "2026.09.01(화) - 2026.12.15(금)",
  },
  {
    icon: onePerPersonIcon,
    label: "중복 신청 불가",
    value: "1인당 1개의 사물함만 신청 가능해요.",
  },
  {
    icon: applyPeriodIcon,
    label: "신청기간",
    value: "2026.09.01(화) - 2026.12.15(금)",
  },
];
