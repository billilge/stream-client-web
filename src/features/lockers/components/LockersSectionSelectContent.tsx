import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { ActionArea, ActionAreaButton } from "@wanteddev/wds";
import { Navigate } from "react-router-dom";

import { HOME_PATH } from "@/features/home/constants/home";
import LockersFloorMap from "@/features/lockers/components/LockersFloorMap";
import { LOCKER_ASSIGNMENT_PATH } from "@/features/lockers/constants/lockers";
import {
  type LockersSection,
  toLockersSections,
} from "@/features/lockers/constants/lockersSections";
import {
  hasLockerInPeriod,
  lockersQueries,
} from "@/shared/entities/lockers/lockersQueries";

interface LockersSectionSelectBodyProps {
  // 받는 동안은 비워 두고 카드 자리만 스켈레톤으로 그린다
  sections?: Map<string, LockersSection>;
  selectedSectionId: number | null;
  onSelect: (sectionId: number) => void;
  onConfirm: (sectionId: number) => void;
}

// 평면도 + 선택 완료 버튼. 새로고침으로 고른 구역이 마감되면 선택을 풀어 버튼을 잠근다.
export function LockersSectionSelectBody({
  sections,
  selectedSectionId,
  onSelect,
  onConfirm,
}: LockersSectionSelectBodyProps) {
  const selectedSection = [...(sections?.values() ?? [])].find(
    (section) =>
      section.sectionId === selectedSectionId && section.status !== "full",
  );

  return (
    <>
      <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-1 pb-2">
        <LockersFloorMap
          onSelect={onSelect}
          sections={sections}
          selectedSectionId={selectedSection?.sectionId ?? null}
        />
      </div>

      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        <ActionAreaButton
          disabled={!selectedSection}
          onClick={() =>
            selectedSection && onConfirm(selectedSection.sectionId)
          }
          sx={{ paddingBlock: "16px" }}
        >
          {selectedSection ? "선택 완료" : "사물함 구역을 선택해 주세요"}
        </ActionAreaButton>
      </ActionArea>
    </>
  );
}

type LockersSectionSelectContentProps = Omit<
  LockersSectionSelectBodyProps,
  "sections"
>;

// 구역 목록은 운영 회차마다 달라서 기간 조회의 회차 id로 받는다. 보여줄 회차가 없으면 홈으로,
// 이번 회차에 이미 배정받았으면 배정 상태로 보낸다(주소로 바로 들어온 경우).
function LockersSectionSelectContent(props: LockersSectionSelectContentProps) {
  const [{ data: period }, { data: applications }] = useSuspenseQueries({
    queries: [lockersQueries.period(), lockersQueries.myApplications()],
  });

  if (!period) {
    return <Navigate replace to={HOME_PATH} />;
  }
  if (hasLockerInPeriod(applications, period.lockerPeriodId)) {
    return <Navigate replace to={LOCKER_ASSIGNMENT_PATH} />;
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

  return <LockersSectionSelectBody sections={sections} {...props} />;
}

export default LockersSectionSelectContent;
