import LockersLockerCell from "@/features/lockers/components/LockersLockerCell";
import type { LockersLockerGroup } from "@/features/lockers/constants/lockersLockers";

interface LockersLockerGridProps {
  group: LockersLockerGroup;
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

// Figma: Locker Grid (nodeId 2159:110832 외) — 칸 사이 6px. 열 수는 묶음의 첫 행 길이를 따른다.
function LockersLockerGrid({
  group,
  selectedLockerNumber,
  onSelect,
}: LockersLockerGridProps) {
  return (
    <div
      className="grid w-max gap-1.5"
      style={{ gridTemplateColumns: `repeat(${group[0].length}, auto)` }}
    >
      {group.flat().map((locker) => (
        <LockersLockerCell
          isSelected={locker.number === selectedLockerNumber}
          key={locker.number}
          locker={locker}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default LockersLockerGrid;
