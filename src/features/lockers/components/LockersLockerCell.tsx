import { Typography } from "@wanteddev/wds";

import lockerUnavailableIcon from "@/assets/icons/lockers/locker-unavailable.svg";
import type { LockersLocker } from "@/features/lockers/constants/lockersLockers";

interface LockersLockerCellProps {
  locker: LockersLocker;
  isSelected: boolean;
  onSelect: (lockerNumber: number) => void;
}

// Figma: Locker Cell (nodeId 2159:110833 외) — Stream 로컬. 28px 정사각형, Orange/95 배경에
// 번호만 Caption 2/Regular로 가운데 둔다.
//
// 선택 불가 칸은 Figma 범례(2159:110819)와 같은 그림이다 — 회색 바탕에 대각선. 칸 번호는 Figma
// 미니맵의 선택 불가 칸(2159:109565)처럼 지운다. 범례 SVG는 `preserveAspectRatio="none"`이라
// 28px로 늘려도 모서리가 4px로 맞는다.
//
// 선택된 칸은 Figma에 없다. 구역 카드(LockersSectionCard)의 선택 표현(Blue/95 배경 +
// Primary/Normal 1px 테두리)을 그대로 따른다 — 테두리는 평소에도 투명으로 둬서 칸 크기를 고정한다.
function LockersLockerCell({
  locker,
  isSelected,
  onSelect,
}: LockersLockerCellProps) {
  if (!locker.isAvailable) {
    return (
      <img
        alt={`${locker.number}번 선택 불가`}
        className="size-7"
        src={lockerUnavailableIcon}
      />
    );
  }

  return (
    <button
      aria-pressed={isSelected}
      className={`flex size-7 items-center justify-center rounded-sm border ${
        isSelected
          ? "border-primary bg-primary-subtle"
          : "border-transparent bg-orange-95"
      }`}
      onClick={() => onSelect(locker.number)}
      type="button"
    >
      <Typography
        as="span"
        color="semantic.label.neutral"
        variant="caption2"
        weight="regular"
      >
        {locker.number}
      </Typography>
    </button>
  );
}

export default LockersLockerCell;
