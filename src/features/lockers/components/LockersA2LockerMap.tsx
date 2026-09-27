import { Typography } from "@wanteddev/wds";

import LockersLockerGrid from "@/features/lockers/components/LockersLockerGrid";
import LockersShelfLabel from "@/features/lockers/components/LockersShelfLabel";
import { LOCKERS_A2_GROUP } from "@/features/lockers/constants/lockersLockers";

interface LockersA2LockerMapProps {
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

// 옆 구역·호실처럼 고를 수 없는 자리. 구역 평면도(LockersFloorMap)의 MapArea와 같은 점선 상자다.
function MapArea({ label, className }: { label: string; className: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line-solid-normal border-dashed bg-background-normal py-8 ${className}`}
    >
      <Typography
        as="p"
        color="semantic.label.assistive"
        variant="caption1"
        weight="medium"
      >
        {label}
      </Typography>
    </div>
  );
}

// Figma: A-2구역 Locker Grid Section (nodeId 2159:109622) — 칸 묶음 옆이 B-1구역, 복도 건너편이
// 231호실이다. 실제 공간 배치라 레이아웃이 갖는다. 화면 폭(335px) 안에 들어가서 스크롤이 생기지 않는다.
function LockersA2LockerMap({
  selectedLockerNumber,
  onSelect,
}: LockersA2LockerMapProps) {
  return (
    <div className="flex w-max items-start gap-3">
      <LockersShelfLabel className="h-24" />
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-start justify-center gap-3">
          <LockersLockerGrid
            group={LOCKERS_A2_GROUP}
            onSelect={onSelect}
            selectedLockerNumber={selectedLockerNumber}
          />
          <MapArea className="w-[169px] self-stretch" label="B-1구역" />
        </div>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          복도
        </Typography>
        <MapArea className="w-full" label="231호실" />
      </div>
    </div>
  );
}

export default LockersA2LockerMap;
