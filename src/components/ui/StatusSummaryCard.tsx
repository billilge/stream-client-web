import { ContentBadge, Skeleton, Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";

export interface StatusSummaryCardRow {
  label: string;
  value: string;
}

interface StatusSummaryCardProps {
  /** 상태 배지 — 상태별 문구·색은 각 기능 constants의 배지 매핑에서 골라 넘긴다 */
  badge: { label: string; color: "green" | "orange" | "red" };
  title: ReactNode;
  rows: StatusSummaryCardRow[];
}

// Figma: 신청내역 상세 Event Summary (nodeId 1133:46188), 학생회비 납부내역 (3147:147860),
// 사물함 배정 상태 (3147:148357) — 같은 모양의 Stream 로컬 카드라 하나로 모았다.
// 흰 카드 안에 상태 배지 → 제목 → 라벨/값 행. 행을 무엇으로 채울지는 쓰는 쪽이 정한다.
// 행 사이는 6px다. Figma 학생회비 카드만 8px로 그려져 있는데 디자인 실수로 보고 맞췄다(#120).
function StatusSummaryCard({ badge, title, rows }: StatusSummaryCardProps) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-xl bg-background-normal p-4">
      <ContentBadge
        accentColor={`semantic.accent.foreground.${badge.color}`}
        color="accent"
        size="small"
        variant="solid"
      >
        {badge.label}
      </ContentBadge>
      <Typography
        as="p"
        color="semantic.label.normal"
        variant="heading2"
        weight="bold"
      >
        {title}
      </Typography>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div className="flex gap-2" key={row.label}>
            <Typography
              as="p"
              color="semantic.label.alternative"
              variant="label2"
              weight="regular"
            >
              {row.label}
            </Typography>
            <Typography
              as="p"
              color="semantic.label.neutral"
              variant="label2"
              weight="regular"
            >
              {row.value}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatusSummaryCardSkeletonProps {
  /** 행마다 막대 폭 — 행 수만큼 넘긴다 */
  rowWidths: string[];
  badgeWidth?: string;
  titleWidth?: string;
}

// 데이터를 받는 동안 StatusSummaryCard 자리를 채운다 — 배지·제목·행 높이와 간격을 카드와 같게 둬서,
// 데이터가 들어와도 아래 내용이 밀리지 않는다.
export function StatusSummaryCardSkeleton({
  rowWidths,
  badgeWidth = "64px",
  titleWidth = "60%",
}: StatusSummaryCardSkeletonProps) {
  const animation = useSkeletonAnimation();

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-background-normal p-4">
      <Skeleton
        animation={animation}
        height="24px"
        radius="6px"
        variant="rectangle"
        width={badgeWidth}
      />
      <Skeleton
        animation={animation}
        height="28px"
        variant="text"
        width={titleWidth}
      />
      <div className="flex flex-col gap-1.5">
        {rowWidths.map((width, index) => (
          <Skeleton
            animation={animation}
            height="18px"
            // biome-ignore lint/suspicious/noArrayIndexKey: 행 수가 고정된 자리 표시라 순서가 바뀌지 않는다
            key={index}
            variant="text"
            width={width}
          />
        ))}
      </div>
    </div>
  );
}

export default StatusSummaryCard;
