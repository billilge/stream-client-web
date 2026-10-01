import LockersLockerCell from "@/features/lockers/components/LockersLockerCell";
import type { LockersSectionLocker } from "@/features/lockers/constants/lockersSectionDetails";

interface LockersLockerGridProps {
  /** layout의 lockerGroup.rows — 숫자는 lockerNumber, null은 칸이 없는 빈 자리 */
  rows: (number | null)[][];
  /** 구역의 사물함을 lockerNumber로 찾는 표 */
  lockers: ReadonlyMap<number, LockersSectionLocker>;
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

// Figma: Locker Grid (nodeId 2159:110832 외) — 칸 사이 6px. 열 수는 가장 긴 행을 따른다.
// layout에 있는데 lockers에 없는 번호는 서버 데이터가 어긋난 경우라, 칸 대신 빈 자리로 둔다.
function LockersLockerGrid({
  rows,
  lockers,
  selectedLockerNumber,
  onSelect,
}: LockersLockerGridProps) {
  const columnCount = Math.max(...rows.map((row) => row.length));

  return (
    <div
      className="grid w-max gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columnCount}, auto)` }}
    >
      {rows.flatMap((row, rowIndex) =>
        row.map((lockerNumber, columnIndex) => {
          const locker =
            lockerNumber === null ? undefined : lockers.get(lockerNumber);

          if (locker === undefined) {
            return (
              <div
                className="size-7"
                // biome-ignore lint/suspicious/noArrayIndexKey: 내용 없이 자리만 차지하는 빈 칸이라 행·열 위치 말고 구분할 값이 없다
                key={`empty-${rowIndex}-${columnIndex}`}
              />
            );
          }

          return (
            <LockersLockerCell
              isSelected={locker.lockerNumber === selectedLockerNumber}
              key={locker.lockerNumber}
              locker={locker}
              onSelect={onSelect}
            />
          );
        }),
      )}
    </div>
  );
}

export default LockersLockerGrid;
