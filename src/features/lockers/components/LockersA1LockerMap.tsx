import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import LockersLockerGrid from "@/features/lockers/components/LockersLockerGrid";
import LockersShelfLabel from "@/features/lockers/components/LockersShelfLabel";
import {
  LOCKERS_A1_GROUPS,
  type LockersLockerGroup,
} from "@/features/lockers/constants/lockersLockers";

interface LockersA1LockerMapProps {
  selectedLockerNumber: number | null;
  onSelect: (lockerNumber: number) => void;
}

// 창문·벽면처럼 고를 수 없는 자리 표시. Figma "Direction Label"·"Aisle"
function MapLabel({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-sm bg-background-alternative ${className}`}
    >
      <Typography
        as="p"
        color="semantic.label.alternative"
        // 벽면 라벨은 Figma가 한 글자씩 줄을 바꾸고 단어 사이에 빈 줄을 둔다
        sx={{ textAlign: "center", whiteSpace: "pre-line" }}
        variant="caption2"
        weight="medium"
      >
        {children}
      </Typography>
    </div>
  );
}

// Figma: Zone Area (nodeId 2159:110831 외) — 칸 묶음을 감싸는 테두리
function ZoneArea({
  group,
  selectedLockerNumber,
  onSelect,
}: { group: LockersLockerGroup } & LockersA1LockerMapProps) {
  return (
    <div className="shrink-0 rounded-lg border border-line-solid-alternative p-3">
      <LockersLockerGrid
        group={group}
        onSelect={onSelect}
        selectedLockerNumber={selectedLockerNumber}
      />
    </div>
  );
}

// Figma: A-1구역 Locker Grid Container (nodeId 2159:110821) — 창문을 사이에 두고 벽면 세 곳에
// 칸 묶음이 붙어 있다. 실제 공간 배치라 데이터가 아니라 이 레이아웃이 갖는다(구역 평면도와 같은 방침).
// 폭이 화면보다 넓어서(약 620px) 부모가 좌우 스크롤로 보여준다.
//
// Figma의 Shelf Label은 높이가 1px로 깨져 있어서, 미니맵(2159:110761)처럼 칸 묶음 줄(122px)
// 높이에 맞춘다.
function LockersA1LockerMap({
  selectedLockerNumber,
  onSelect,
}: LockersA1LockerMapProps) {
  const zoneProps = { onSelect, selectedLockerNumber };

  return (
    <div className="flex w-max flex-col items-end gap-8">
      <div className="flex items-end gap-3">
        <LockersShelfLabel className="h-[122px]" />
        <div className="flex flex-col items-center gap-2">
          <MapLabel className="w-56 py-1.5">창문</MapLabel>
          <div className="flex h-[122px] items-center gap-3">
            <MapLabel className="h-full px-1.5">{"왼\n쪽\n\n벽\n면"}</MapLabel>
            <ZoneArea group={LOCKERS_A1_GROUPS.left} {...zoneProps} />
            <ZoneArea group={LOCKERS_A1_GROUPS.middle} {...zoneProps} />
            <ZoneArea group={LOCKERS_A1_GROUPS.right} {...zoneProps} />
            <MapLabel className="h-full px-1.5">
              {"오\n른\n쪽\n\n벽\n면"}
            </MapLabel>
          </div>
        </div>
      </div>
      {/* Figma에서 복도 라벨은 560px 폭 가운데 정렬이라 칸 묶음 줄 아래 가운데에 온다 */}
      <div className="w-[560px]">
        <Typography
          as="p"
          color="semantic.label.alternative"
          sx={{ textAlign: "center" }}
          variant="caption1"
          weight="medium"
        >
          복도
        </Typography>
      </div>
    </div>
  );
}

export default LockersA1LockerMap;
