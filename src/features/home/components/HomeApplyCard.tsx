import { Button, ContentBadge, Typography } from "@wanteddev/wds";

import { formatDday } from "@/lib/date";
import type { HomeApplySection } from "@/shared/entities/home/homeTypes";

// Figma: Upcoming Event Card (nodeId 3147:146262), Upcoming Application Card (3491:149798)
// 행사·사물함이 같은 모양이다. 배지 옆 `행사일` 문구는 Figma에서 투명 처리돼 있어 그리지 않는다.
// 버튼 안에 버튼을 둘 수 없어서, 카드 선택 버튼을 카드 전체에 덮어 깔고 신청하기 버튼만 그 위로 올린다
// (행사 목록 카드와 같은 방식). isolate로 카드 안에서만 z 순서를 정한다.
interface HomeApplyCardProps {
  section: HomeApplySection;
  onSelect: () => void;
  onApply: () => void;
}

function HomeApplyCard({ section, onSelect, onApply }: HomeApplyCardProps) {
  // 사물함 제목은 운영 회차 이름(예: 2026-2학기)이라 무엇을 신청하는지 붙여 준다
  const title =
    section.targetType === "LOCKER"
      ? `${section.title} 사물함 배정`
      : section.title;

  return (
    <div className="relative isolate flex items-center gap-4 rounded-xl bg-background-normal p-4">
      {/* 사물함은 상세 없이 신청으로 가서 "상세 보기" 대신 보이는 제목을 그대로 이름으로 쓴다 */}
      <button
        aria-label={title}
        className="absolute inset-0 z-10 rounded-xl"
        onClick={onSelect}
        type="button"
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
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
          {title}
        </Typography>
      </div>
      <div className="relative z-20 shrink-0">
        <Button onClick={onApply} size="small">
          신청하기
        </Button>
      </div>
    </div>
  );
}

export default HomeApplyCard;
