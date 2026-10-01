import { Typography } from "@wanteddev/wds";

import LockersLockerGrid from "@/features/lockers/components/LockersLockerGrid";
import LockersMapArea from "@/features/lockers/components/LockersMapArea";
import LockersShelfLabel from "@/features/lockers/components/LockersShelfLabel";
import { LOCKERS_A2_GROUP } from "@/features/lockers/constants/lockersLockers";
import { LOCKERS_SECTION_DETAILS } from "@/features/lockers/constants/lockersSectionDetails";

const A2_LOCKERS = new Map(
  LOCKERS_SECTION_DETAILS["A-2"].lockers.map((locker) => [
    locker.lockerNumber,
    locker,
  ]),
);

interface LockersA2LockerMapProps {
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

// Figma: A-2구역 Locker Grid Section (nodeId 2159:109622) — 칸 묶음 옆이 B-1구역, 복도 건너편이
// 231호실이다. 실제 공간 배치라 레이아웃이 갖는다. 화면 폭(335px) 안에 들어가서 스크롤이 생기지 않는다.
function LockersA2LockerMap({
  selectedLockerNumber,
  onSelect,
}: LockersA2LockerMapProps) {
  return (
    <div className="flex w-max items-start gap-3">
      <LockersShelfLabel height={96} />
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-start justify-center gap-3">
          <LockersLockerGrid
            lockers={A2_LOCKERS}
            rows={LOCKERS_A2_GROUP.map((row) =>
              row.map((locker) => locker.number),
            )}
            onSelect={onSelect}
            selectedLockerNumber={selectedLockerNumber}
          />
          <LockersMapArea
            className="w-[169px] self-stretch py-8"
            label="B-1구역"
          />
        </div>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          복도
        </Typography>
        <LockersMapArea className="w-full py-8" label="231호실" />
      </div>
    </div>
  );
}

export default LockersA2LockerMap;
