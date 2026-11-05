import { Button, ContentBadge, Typography } from "@wanteddev/wds";

import { formatDday } from "@/lib/date";
import type { HomeApplySection } from "@/shared/entities/home/homeTypes";

// Figma: Upcoming Event Card (nodeId 3147:146262), Upcoming Application Card (3491:149798)
// 행사·사물함이 같은 모양이다. 배지 옆 `행사일` 문구는 Figma에서 투명 처리돼 있어 그리지 않는다.
// 버튼 안에 버튼을 둘 수 없어서, 카드 선택은 배지·제목 영역에만 건다(행사 목록 카드와 같은 방식).
interface HomeApplyCardProps {
  section: HomeApplySection;
  onSelect: () => void;
  onApply: () => void;
}

function HomeApplyCard({ section, onSelect, onApply }: HomeApplyCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-background-normal p-4">
      <button
        className="flex min-w-0 flex-1 flex-col items-start gap-2 text-left"
        onClick={onSelect}
        type="button"
      >
        <ContentBadge
          accentColor="semantic.accent.foreground.redOrange"
          color="accent"
          size="small"
          variant="solid"
        >
          신청마감 {formatDday(section.applyEndAt)}
        </ContentBadge>
        <Typography
          as="p"
          color="semantic.label.normal"
          variant="body1"
          weight="bold"
        >
          {/* 사물함 제목은 운영 회차 이름(예: 2026-2학기)이라 무엇을 신청하는지 붙여 준다 */}
          {section.targetType === "LOCKER"
            ? `${section.title} 사물함 배정`
            : section.title}
        </Typography>
      </button>
      <Button onClick={onApply} size="small">
        신청하기
      </Button>
    </div>
  );
}

export default HomeApplyCard;
