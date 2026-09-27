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
// 선택 전(State=Empty)은 안내 문구 + 잠긴 버튼, 선택 후(Figma "사물함 선택 시" 2159:113198)는
// 사물함 번호를 Primary/Normal SemiBold로 보여주고 버튼을 연다.
//
// 사물함 번호는 Figma가 B-1구역 25번을 "B-25"로 적는다 — 구역 번호 없이 동 이름(구역 이름의
// 앞글자)과 칸 번호만 쓴다. 칸 번호가 같은 동 안에서 겹치지 않아서(A-1은 1~36, A-2는 82~90) 이걸로 충분하다.
function LockersSelectedLockerBar({
  sectionName,
  selectedLockerNumber,
  onSubmit,
}: LockersSelectedLockerBarProps) {
  const hasSelection = selectedLockerNumber !== null;
  const lockerLabel = `${sectionName.split("-")[0]}-${selectedLockerNumber}`;

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
        {hasSelection ? (
          <Typography
            as="p"
            color="semantic.primary.normal"
            variant="label1"
            weight="bold"
          >
            {lockerLabel}
          </Typography>
        ) : (
          <Typography
            as="p"
            color="semantic.label.alternative"
            variant="caption1"
            weight="regular"
          >
            선택한 사물함이 없어요.
          </Typography>
        )}
      </div>
      <ActionArea>
        {/* 높이 보정 이유는 wds-component-usage.md "Action Area 메인 버튼 높이" 참고 */}
        <ActionAreaButton
          disabled={!hasSelection}
          onClick={onSubmit}
          sx={{ paddingBlock: "16px" }}
        >
          {hasSelection ? "사물함 신청하기" : "사물함을 선택해 주세요"}
        </ActionAreaButton>
      </ActionArea>
      <div className="h-safe-bottom-extra sm:h-[14px]" />
    </div>
  );
}

export default LockersSelectedLockerBar;
