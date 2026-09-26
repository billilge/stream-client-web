import {
  ActionArea,
  ActionAreaButton,
  TopNavigationButton,
} from "@wanteddev/wds";
import { IconChevronLeft, IconRefresh } from "@wanteddev/wds-icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import LockersFloorMap from "@/features/lockers/components/LockersFloorMap";

// Figma: 사물함 구역 선택 전 (nodeId 1737:218452), 선택완료 (1737:218489)
// 새로고침은 잔여 수량 API가 붙기 전까지 표시만 한다.
// 선택 후 이동할 화면은 아직 디자인이 없어서 지금은 아무것도 하지 않는다.
function LockersZoneSelectScreen() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
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
        <TopNavigationButton aria-label="새로고침" variant="icon">
          <IconRefresh />
        </TopNavigationButton>
      }
      variant="normal"
    />,
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hidden flex-1 overflow-y-auto px-5">
        <LockersFloorMap
          onSelect={setSelectedZoneId}
          selectedZoneId={selectedZoneId}
        />
      </div>

      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        <ActionAreaButton
          disabled={selectedZoneId === null}
          sx={{ paddingBlock: "16px" }}
        >
          {selectedZoneId === null ? "구역을 선택해 주세요" : "선택하기"}
        </ActionAreaButton>
      </ActionArea>
    </div>
  );
}

export default LockersZoneSelectScreen;
