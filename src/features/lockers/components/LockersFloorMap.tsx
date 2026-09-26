import { Typography } from "@wanteddev/wds";
import { IconChevronUp } from "@wanteddev/wds-icon";
import type { ReactNode } from "react";

import restroomIcon from "@/assets/icons/lockers/restroom.svg";
import stairsIcon from "@/assets/icons/lockers/stairs.svg";
import LockersSectionCard from "@/features/lockers/components/LockersSectionCard";
import {
  LOCKERS_LEFT_SECTIONS,
  LOCKERS_RIGHT_SECTIONS,
  LOCKERS_RIGHT_SECTIONS_BELOW_STAIRS,
} from "@/features/lockers/constants/lockersSections";

interface LockersFloorMapProps {
  selectedSectionId: string | null;
  onSelect: (sectionId: string) => void;
}

// 호실·화장실처럼 고를 수 없는 자리. 점선 테두리에 라벨만 가운데 둔다.
function MapArea({
  children,
  className,
}: {
  children: ReactNode;
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
//
// 호실·화장실·계단·복도 위치는 실제 건물 구조라 데이터로 받지 않고 여기 레이아웃이 갖는다.
// 구역 카드와 잔여 수량만 데이터에서 온다.
//
// Figma는 375×812 한 벌만 그려뒀지만 ScreenLayout은 폰이든 데스크톱(480px 컬럼)이든 높이를
// 뷰포트로 꽉 채운다. 그래서 치수를 고정하지 않고 **Figma 값을 flex 비율로** 옮겨서
// 남는 공간을 비례 배분한다 — 열 124:67:124, 왼쪽 열 186:74:186:134, 오른쪽 열 74…34:74.
// 열 사이 간격(10px)과 카드 사이 간격(왼쪽 4px·오른쪽 6px)만 Figma 값 그대로 고정이다.
function LockersFloorMap({
  selectedSectionId,
  onSelect,
}: LockersFloorMapProps) {
  const renderCard = (section: (typeof LOCKERS_RIGHT_SECTIONS)[number]) => (
    <LockersSectionCard
      isSelected={section.id === selectedSectionId}
      key={section.id}
      onSelect={onSelect}
      section={section}
    />
  );

  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex flex-[124] flex-col gap-1">
        <MapArea className="flex-[186]">
          <AreaLabel label="231호실" />
        </MapArea>
        {LOCKERS_LEFT_SECTIONS.map(renderCard)}
        <MapArea className="flex-[186]">
          <AreaLabel label="232호실" />
        </MapArea>
        <MapArea className="flex-[134]">
          <AreaLabel icon={restroomIcon} label="화장실" />
        </MapArea>
      </div>

      {/* 가운데 열은 복도다 — 카드가 없고 방향 표시만 있다.
          빈 칸도 Figma 비율(위 32 / 라벨 사이 176 / 아래 330)을 flex로 옮긴다.
          "정릉시장 방향"은 열보다 넓어서 Figma처럼 한 줄로 넘치게 둔다. */}
      <div className="flex flex-[67] flex-col items-center">
        <div className="flex-[32]" />
        <div className="flex shrink-0 flex-col items-center">
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
        <div className="flex-[176]" />
        <Typography
          as="p"
          color="semantic.label.alternative"
          variant="caption1"
          weight="medium"
        >
          복도
        </Typography>
        <div className="flex-[330]" />
      </div>

      <div className="flex flex-[124] flex-col gap-1.5">
        {LOCKERS_RIGHT_SECTIONS.map(renderCard)}
        <MapArea className="flex-[34]">
          <AreaLabel icon={stairsIcon} label="계단" />
        </MapArea>
        {LOCKERS_RIGHT_SECTIONS_BELOW_STAIRS.map(renderCard)}
      </div>
    </div>
  );
}

export default LockersFloorMap;
