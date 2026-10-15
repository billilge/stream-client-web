import LockersCell from "@/features/lockers/components/LockersCell";
import type { LockersSectionLocker } from "@/features/lockers/constants/lockersSectionDetails";

interface LockersGridProps {
  rows: (number | null)[][];
  lockers: ReadonlyMap<number, LockersSectionLocker>;
  selectedLockerNumber: number | null;
  /** 없으면 보기 전용 — 칸을 누를 수 없다(내 사물함 화면) */
  onSelect?: (lockerNumber: number) => void;
}

// Figma: Locker Grid (nodeId 2159:110832 외)
// layout에는 있는데 lockers에 없는 번호(서버 데이터가 어긋난 경우)는 빈 자리로 둔다.
function LockersGrid({
  rows,
  lockers,
  selectedLockerNumber,
  onSelect,
}: LockersGridProps) {
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
            <LockersCell
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

export default LockersGrid;
