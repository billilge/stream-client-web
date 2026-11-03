import { useQueryClient } from "@tanstack/react-query";
import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconReset } from "@wanteddev/wds-icon";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersSectionSelectContent, {
  LockersSectionSelectBody,
} from "@/features/lockers/components/LockersSectionSelectContent";
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
            queryClient.refetchQueries({
              queryKey: lockersKeys.sections(),
              type: "active",
            })
          }
          variant="icon"
        >
          <IconReset />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  const goToSection = (sectionId: number) =>
    navigate(`/lockers/apply/sections/${sectionId}`, { viewTransition: true });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Suspense
        fallback={
          <LockersSectionSelectBody
            onConfirm={goToSection}
            onSelect={setSelectedSectionId}
            selectedSectionId={null}
          />
        }
      >
        <LockersSectionSelectContent
          onConfirm={goToSection}
          onSelect={setSelectedSectionId}
          selectedSectionId={selectedSectionId}
        />
      </Suspense>
    </div>
  );
}

export default LockersSectionSelectScreen;
