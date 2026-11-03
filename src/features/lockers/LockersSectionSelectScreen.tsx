import { useQueryClient } from "@tanstack/react-query";
import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft, IconReset } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersFloorMap from "@/features/lockers/components/LockersFloorMap";
import LockersSectionSelectContent from "@/features/lockers/components/LockersSectionSelectContent";
import { lockersKeys } from "@/shared/entities/lockers/lockersKeys";

// Figma: 사물함 구역 선택 전 (nodeId 1737:218452), 선택완료 (1737:218489)
function LockersSectionSelectScreen() {
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="사물함 구역 선택"
      trailing={
        <TopNavigationButton
          aria-label="새로고침"
          onClick={() =>
            queryClient.refetchQueries({ queryKey: lockersKeys.sections() })
          }
          variant="icon"
        >
          <IconReset />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-1 pb-2">
        <Suspense
          fallback={
            <LockersFloorMap
              onSelect={setSelectedSectionId}
              selectedSectionId={null}
            />
          }
        >
          <LockersSectionSelectContent
            onSelect={setSelectedSectionId}
            selectedSectionId={selectedSectionId}
          />
        </Suspense>
      </div>

      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        <ActionAreaButton
          disabled={selectedSectionId === null}
          onClick={() =>
            navigate(`/lockers/apply/sections/${selectedSectionId}`, {
              viewTransition: true,
            })
          }
          sx={{ paddingBlock: "16px" }}
        >
          {selectedSectionId === null
            ? "사물함 구역을 선택해 주세요"
            : "선택 완료"}
        </ActionAreaButton>
      </ActionArea>
    </div>
  );
}

export default LockersSectionSelectScreen;
