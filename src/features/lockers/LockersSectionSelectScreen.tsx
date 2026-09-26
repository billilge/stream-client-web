import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft, IconReset } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersFloorMap from "@/features/lockers/components/LockersFloorMap";

// Figma: 사물함 구역 선택 전 (nodeId 1737:218452), 선택완료 (1737:218489)
// 새로고침(Figma Icon/Normal/Reset)은 잔여 수량 API가 없어 지금은 페이지를 다시 읽는다.
// 선택 후 이동할 화면은 아직 디자인이 없어서 지금은 아무것도 하지 않는다.
function LockersSectionSelectScreen() {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();

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
          // 잔여 수량 API가 붙으면 페이지를 다시 읽지 말고 그 조회만 다시 하도록 바꾼다
          onClick={() => window.location.reload()}
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
      <div className="flex min-h-0 flex-1 flex-col px-5 pt-1 pb-2">
        <LockersFloorMap
          onSelect={setSelectedSectionId}
          selectedSectionId={selectedSectionId}
        />
      </div>

      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        {/* Figma는 미선택일 때 문구가 "구역을 선택해 주세요"로 바뀌지만,
            문구는 그대로 두고 잠그기만 하기로 정했다 */}
        <ActionAreaButton
          disabled={selectedSectionId === null}
          sx={{ paddingBlock: "16px" }}
        >
          신청하기
        </ActionAreaButton>
      </ActionArea>
    </div>
  );
}

export default LockersSectionSelectScreen;
