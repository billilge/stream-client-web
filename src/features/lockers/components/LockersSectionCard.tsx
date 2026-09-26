import { ContentBadge, Typography } from "@wanteddev/wds";

import type {
  LockersZone,
  LockersZoneStatus,
} from "@/features/lockers/constants/lockersZones";

interface LockersZoneCardProps {
  zone: LockersZone;
  isSelected: boolean;
  onSelect: (zoneId: string) => void;
}

// 마감은 WDS `color="neutral"`(배경 Fill/Normal)이고 나머지 셋은 `color="accent"`로,
// 배경이 accentColor의 8% 투명도로 깔린다 — 둘 다 Figma와 그대로 맞는다.
// 뱃지 크기는 `xsmall`(padding 3/6 + Caption 2, 11px)이다. 빌릴게 반납 뱃지가 쓰는 `small`은
// padding 4/6 + Caption 1(12px)이라 이 화면과 다르다.
const STATUS_BADGES = {
  almostFull: {
    color: "accent",
    label: "마감 임박",
    token: "semantic.accent.foreground.red",
  },
  full: {
    color: "neutral",
    label: "마감",
    token: "semantic.label.alternative",
  },
  normal: {
    color: "accent",
    label: "보통",
    token: "semantic.accent.foreground.orange",
  },
  spacious: {
    color: "accent",
    label: "여유",
    token: "semantic.accent.foreground.green",
  },
} as const satisfies Record<LockersZoneStatus, unknown>;

const CONTAINER_CLASS_NAMES = {
  full: "bg-cool-neutral-97",
  normal: "bg-background-alternative",
  selected: "border border-primary bg-primary-subtle",
} as const;

// Figma: 사물함 구역 선택 Zone Button (nodeId 1737:218476 외) — WDS에 대응 컴포넌트가 없는
// Stream 로컬 카드다. 안쪽 혼잡도 뱃지만 WDS `ContentBadge`를 쓴다.
//
// 마감 구역은 고를 수 없어서 버튼을 잠근다. Figma에 잠금 상태의 선택 모습이 따로 없는 것도
// 고를 수 없다는 뜻으로 읽었다.
function LockersZoneCard({ zone, isSelected, onSelect }: LockersZoneCardProps) {
  const badge = STATUS_BADGES[zone.status];
  const isFull = zone.status === "full";
  const containerClassName = isSelected
    ? CONTAINER_CLASS_NAMES.selected
    : CONTAINER_CLASS_NAMES[isFull ? "full" : "normal"];

  return (
    <button
      className={`flex h-[74px] flex-col items-center justify-center gap-1 rounded-lg px-[7px] ${containerClassName}`}
      disabled={isFull}
      onClick={() => onSelect(zone.id)}
      type="button"
    >
      <ContentBadge
        accentColor={badge.color === "accent" ? badge.token : undefined}
        color={badge.color}
        neutralColor={badge.color === "neutral" ? badge.token : undefined}
        size="xsmall"
        variant="solid"
      >
        {badge.label}
      </ContentBadge>
      <Typography
        as="p"
        color={isFull ? "semantic.label.assistive" : "semantic.label.normal"}
        variant="caption1"
        weight="medium"
      >
        {zone.name}
      </Typography>
      <Typography
        as="p"
        color={
          isFull ? "semantic.label.assistive" : "semantic.label.alternative"
        }
        variant="caption2"
        weight="regular"
      >
        {/* Figma가 잔여 숫자에만 SemiBold를 준다 */}
        잔여 <span className="font-semibold">{zone.remaining}</span>/
        {zone.total}
      </Typography>
    </button>
  );
}

export default LockersZoneCard;
