import { ContentBadge, Typography } from "@wanteddev/wds";

import type {
  LockersSection,
  LockersSectionStatus,
} from "@/features/lockers/constants/lockersSections";

interface LockersSectionCardProps {
  section: LockersSection;
  isSelected: boolean;
  onSelect: (sectionId: string) => void;
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
} as const satisfies Record<LockersSectionStatus, unknown>;

// 선택됐을 때만 테두리가 생기면 콘텐츠 박스가 1px씩 줄어서 가운데 정렬된 내용이 밀린다.
// 항상 1px 테두리를 두되 평소엔 투명으로 둬서 박스 크기를 고정한다
// (배경이 테두리 자리까지 깔려서 테두리 없는 것과 똑같이 보인다).
const CONTAINER_CLASS_NAMES = {
  full: "border-transparent bg-cool-neutral-97",
  normal: "border-transparent bg-background-alternative",
  selected: "border-primary bg-primary-subtle",
} as const;

// Figma: 사물함 구역 선택 Zone Button (nodeId 1737:218476 외 — Figma 레이어 이름은 Zone이다) — WDS에 대응 컴포넌트가 없는
// Stream 로컬 카드다. 안쪽 혼잡도 뱃지만 WDS `ContentBadge`를 쓴다.
//
// 마감 구역은 고를 수 없어서 버튼을 잠근다. Figma에 잠금 상태의 선택 모습이 따로 없는 것도
// 고를 수 없다는 뜻으로 읽었다.
function LockersSectionCard({
  section,
  isSelected,
  onSelect,
}: LockersSectionCardProps) {
  const badge = STATUS_BADGES[section.status];
  const isFull = section.status === "full";
  const containerClassName = isSelected
    ? CONTAINER_CLASS_NAMES.selected
    : CONTAINER_CLASS_NAMES[isFull ? "full" : "normal"];

  return (
    <button
      className={`flex flex-[74] flex-col items-center justify-center gap-1 rounded-lg border px-[7px] ${containerClassName}`}
      disabled={isFull}
      onClick={() => onSelect(section.id)}
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
        {section.name}
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
        잔여 <span className="font-semibold">{section.remaining}</span>/
        {section.total}
      </Typography>
    </button>
  );
}

export default LockersSectionCard;
