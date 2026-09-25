import { Typography } from "@wanteddev/wds";
import { IconChevronUp } from "@wanteddev/wds-icon";

import restroomIcon from "@/assets/icons/lockers/restroom.svg";
import stairsIcon from "@/assets/icons/lockers/stairs.svg";
import LockersZoneCard from "@/features/lockers/components/LockersZoneCard";
import {
  LOCKERS_LEFT_ZONES,
  LOCKERS_RIGHT_ZONES,
  LOCKERS_RIGHT_ZONES_BELOW_STAIRS,
} from "@/features/lockers/constants/lockersZones";

interface LockersFloorMapProps {
  selectedZoneId: string | null;
  onSelect: (zoneId: string) => void;
}

// 호실·화장실처럼 고를 수 없는 자리. 점선 테두리에 라벨만 가운데 둔다.
function MapArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-line-solid-normal border-dashed bg-background-normal ${className}`}
    >
      {children}
    </div>
  );
}

function AreaLabel({ icon, label }: { icon?: string; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {icon !== undefined && (
        <img alt="" className="size-6 shrink-0" src={icon} />
      )}
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

// Figma: 사물함 구역 선택 Floor Map (nodeId 1737:218457)
// 3열 고정 배치다 — 호실·화장실·계단·복도 위치는 실제 건물 구조라 데이터로 받지 않고
// 여기 레이아웃이 갖는다. 구역 카드와 잔여 수량만 데이터에서 온다.
// 열마다 카드 간격이 다르다(왼쪽 4px, 오른쪽 6px) — Figma 값 그대로다.
function LockersFloorMap({ selectedZoneId, onSelect }: LockersFloorMapProps) {
  return (
    <div className="flex gap-2.5">
      <div className="flex w-[124px] flex-col gap-1">
        <MapArea className="h-[186px]">
          <AreaLabel label="231호실" />
        </MapArea>
        {LOCKERS_LEFT_ZONES.map((zone) => (
          <LockersZoneCard
            isSelected={zone.id === selectedZoneId}
            key={zone.id}
            onSelect={onSelect}
            zone={zone}
          />
        ))}
        <MapArea className="h-[186px]">
          <AreaLabel label="232호실" />
        </MapArea>
        <MapArea className="h-[134px]">
          <AreaLabel icon={restroomIcon} label="화장실" />
        </MapArea>
      </div>

      {/* 가운데 열은 복도다 — 카드가 없고 방향 표시만 있다.
          "정릉시장 방향"은 67px 열보다 넓어서 Figma도 한 줄로 넘치게 둔다. */}
      <div className="flex w-[67px] flex-col items-center gap-[176px] pt-8">
        <div className="flex flex-col items-center">
          <IconChevronUp className="size-6 text-label-assistive" />
          <Typography
            as="p"
            color="semantic.label.assistive"
            sx={{ whiteSpace: "nowrap" }}
            variant="caption1"
            weight="medium"
          >
            정릉시장 방향
          </Typography>
        </div>
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          복도
        </Typography>
      </div>

      <div className="flex w-[124px] flex-col gap-1.5">
        {LOCKERS_RIGHT_ZONES.map((zone) => (
          <LockersZoneCard
            isSelected={zone.id === selectedZoneId}
            key={zone.id}
            onSelect={onSelect}
            zone={zone}
          />
        ))}
        <MapArea className="h-[34px]">
          <AreaLabel icon={stairsIcon} label="계단" />
        </MapArea>
        {LOCKERS_RIGHT_ZONES_BELOW_STAIRS.map((zone) => (
          <LockersZoneCard
            isSelected={zone.id === selectedZoneId}
            key={zone.id}
            onSelect={onSelect}
            zone={zone}
          />
        ))}
      </div>
    </div>
  );
}

export default LockersFloorMap;
