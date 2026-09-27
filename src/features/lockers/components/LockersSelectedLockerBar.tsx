import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";

interface LockersSelectedLockerBarProps {
  sectionName: string;
  selectedLockerNumber: number | null;
  onSubmit: () => void;
}

// Figma: Locker Selection Section (nodeId 1658:179182) — Stream 로컬. 위가 둥근 흰 카드에
// "선택한 사물함" 줄(Figma Locker Selector, 1643:178050)과 WDS Action Area를 담는다.
// 그림자는 Figma Shadow/Spread/Small 값 그대로다.
//
// Figma에는 선택 전(State=Empty) 모습만 있다. 고른 뒤에는 같은 자리에 "A-1구역 12번"처럼
// 보여주고 버튼을 연다.
function LockersSelectedLockerBar({
  sectionName,
  selectedLockerNumber,
  onSubmit,
}: LockersSelectedLockerBarProps) {
  const hasSelection = selectedLockerNumber !== null;

  return (
    <div className="shrink-0 rounded-t-3xl bg-background-normal drop-shadow-[0px_0px_30px_rgba(23,23,23,0.1)]">
      <div className="flex items-center justify-between px-9 pt-5 pb-4">
        <Typography
          as="p"
          color="semantic.label.neutral"
          variant="label1"
          weight="medium"
        >
          선택한 사물함
        </Typography>
        <Typography
          as="p"
          color={
            hasSelection
              ? "semantic.label.normal"
              : "semantic.label.alternative"
          }
          variant="caption1"
          weight="regular"
        >
          {hasSelection
            ? `${sectionName}구역 ${selectedLockerNumber}번`
            : "선택한 사물함이 없어요."}
        </Typography>
      </div>
      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        <ActionAreaButton
          disabled={!hasSelection}
          onClick={onSubmit}
          sx={{ paddingBlock: "16px" }}
        >
          {hasSelection ? "신청하기" : "사물함을 선택해 주세요"}
        </ActionAreaButton>
      </ActionArea>
      <div className="h-safe-bottom-extra sm:h-[14px]" />
    </div>
  );
}

export default LockersSelectedLockerBar;
