import { useSuspenseQuery } from "@tanstack/react-query";

import HomeApplyCard from "@/features/home/components/HomeApplyCard";
import { homeQueries } from "@/shared/entities/home/homeQueries";
import type {
  HomeApplySection,
  HomeResponse,
} from "@/shared/entities/home/homeTypes";

function selectApplySections(home: HomeResponse) {
  return home.applySections;
}

interface HomeApplyCardListProps {
  onSelect: (section: HomeApplySection) => void;
  onApply: (section: HomeApplySection) => void;
}

// 운영진이 홈에 노출한 신청 안내 카드 — 지금 신청할 수 있는 것만 오고, 없으면 자리를 차지하지 않는다.
// 카드가 있을지 받기 전에는 알 수 없어서, 받는 동안 HomeScreen의 Suspense는 스켈레톤 없이 자리를 비워 둔다.
function HomeApplyCardList({ onSelect, onApply }: HomeApplyCardListProps) {
  const { data: sections } = useSuspenseQuery({
    ...homeQueries.home(),
    select: selectApplySections,
  });

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-5">
      {sections.map((section) => (
        <HomeApplyCard
          key={`${section.targetType}-${section.targetId}`}
          onApply={() => onApply(section)}
          onSelect={() => onSelect(section)}
          section={section}
        />
      ))}
    </div>
  );
}

export default HomeApplyCardList;
