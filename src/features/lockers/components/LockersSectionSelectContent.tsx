import { useSuspenseQuery } from "@tanstack/react-query";

import LockersFloorMap from "@/features/lockers/components/LockersFloorMap";
import { toLockersSections } from "@/features/lockers/constants/lockersSections";
import { lockersQueries } from "@/shared/entities/lockers/lockersQueries";

interface LockersSectionSelectContentProps {
  selectedSectionId: number | null;
  onSelect: (sectionId: number) => void;
}

// 구역 목록은 운영 회차마다 달라서 기간 조회의 회차 id로 받는다. 보여줄 회차가 없으면 모든 구역을 잠근다.
function LockersSectionSelectContent(props: LockersSectionSelectContentProps) {
  const { data: period } = useSuspenseQuery(lockersQueries.period());

  if (!period) {
    return <LockersFloorMap sections={new Map()} {...props} />;
  }
  return (
    <LockersSectionList lockerPeriodId={period.lockerPeriodId} {...props} />
  );
}

function LockersSectionList({
  lockerPeriodId,
  ...props
}: LockersSectionSelectContentProps & { lockerPeriodId: number }) {
  const { data: sections } = useSuspenseQuery({
    ...lockersQueries.sectionList(lockerPeriodId),
    select: toLockersSections,
  });

  return <LockersFloorMap sections={sections} {...props} />;
}

export default LockersSectionSelectContent;
