import { Typography } from "@wanteddev/wds";

import lockerUnavailableIcon from "@/assets/icons/lockers/locker-unavailable.svg";
import type { LockersSectionLocker } from "@/features/lockers/constants/lockersSectionDetails";

interface LockersLockerCellProps {
  locker: LockersSectionLocker;
  isSelected: boolean;
  /** 없으면 보기 전용 — 칸을 누를 수 없다(내 사물함 화면) */
  onSelect?: (lockerNumber: number) => void;
}

// Figma: Locker Cell (nodeId 2159:110833 외) — Stream 로컬. 28px 정사각형, Orange/95 배경에
// 번호만 Caption 2/Regular로 가운데 둔다.
//
// 선택 불가 칸은 Figma 범례(2159:110819)와 같은 그림이다 — 회색 바탕에 대각선. 칸 번호는 Figma
// 미니맵의 선택 불가 칸(2159:109565)처럼 지운다. 범례 SVG는 `preserveAspectRatio="none"`이라
// 28px로 늘려도 모서리가 4px로 맞는다.
//
// 선택된 칸은 Figma "사물함 선택 시"(2159:113315)대로 Primary/Normal 배경에 번호를
// Background/Normal/Normal(흰색) SemiBold로 바꾼다.
//
// 내 사물함은 Figma에 상태가 없어서 임시로 초록 테두리를 둔다(이미 신청한 칸이라 고를 수 없다).
//
// 보기 전용(내 사물함 화면)에서는 칸을 버튼으로 그리지 않고, 내 칸을 선택된 칸 모양으로 표시한다.
function LockersLockerCell({
  locker,
  isSelected,
  onSelect,
}: LockersLockerCellProps) {
  const isViewOnly = onSelect === undefined;

  if (locker.isMine && !isViewOnly) {
    return (
      <div
        aria-label={`${locker.lockerLabel} 내 사물함`}
        className="flex size-7 items-center justify-center rounded-sm bg-orange-95 ring-2 ring-status-positive ring-inset"
        role="img"
      >
        <Typography
          as="span"
          color="semantic.label.neutral"
          variant="caption2"
          weight="regular"
        >
          {locker.lockerNumber}
        </Typography>
      </div>
    );
  }

  // 내 칸은 서버에서 선택 불가로 올 수 있어서(이미 배정됨) 보기 전용에서도 내 칸으로 그린다
  if (!locker.isAvailable && !locker.isMine) {
    return (
      <img
        alt={`${locker.lockerLabel} 선택 불가`}
        className="size-7"
        src={lockerUnavailableIcon}
      />
    );
  }

  const isHighlighted = isViewOnly ? locker.isMine : isSelected;
  const className = `flex size-7 items-center justify-center rounded-sm ${
    isHighlighted ? "bg-primary" : "bg-orange-95"
  }`;
  const number = (
    <Typography
      as="span"
      color={
        isHighlighted
          ? "semantic.background.normal.normal"
          : "semantic.label.neutral"
      }
      variant="caption2"
      weight={isHighlighted ? "bold" : "regular"}
    >
      {locker.lockerNumber}
    </Typography>
  );

  if (isViewOnly) {
    return (
      <div
        aria-label={
          locker.isMine ? `${locker.lockerLabel} 내 사물함` : locker.lockerLabel
        }
        className={className}
        // 내 사물함 화면이 처음 열릴 때 이 칸이 보이게 스크롤하는 기준(LockersLockerMapView)
        data-my-locker={locker.isMine || undefined}
        role="img"
      >
        {number}
      </div>
    );
  }

  return (
    <button
      aria-pressed={isSelected}
      className={className}
      onClick={() => onSelect(locker.lockerNumber)}
      type="button"
    >
      {number}
    </button>
  );
}

export default LockersLockerCell;
