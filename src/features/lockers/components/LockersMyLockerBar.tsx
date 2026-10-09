import { Typography } from "@wanteddev/wds";

interface LockersMyLockerBarProps {
  lockerLabel: string;
}

// 내 사물함 화면 하단 — 칸 선택 화면의 선택한 사물함 카드(LockersSelectedLockerBar)와 같은 모양에서
// 신청 버튼만 뺐다. 보기 전용이라 할 동작이 없다.
function LockersMyLockerBar({ lockerLabel }: LockersMyLockerBarProps) {
  return (
    <div className="shrink-0 rounded-t-3xl bg-background-normal shadow-spread-small">
      <div className="flex items-center justify-between px-9 py-5">
        <Typography
          as="p"
          color="semantic.label.neutral"
          variant="label1"
          weight="medium"
        >
          내 사물함
        </Typography>
        <Typography
          as="p"
          color="semantic.primary.normal"
          variant="label1"
          weight="bold"
        >
          {lockerLabel}
        </Typography>
      </div>
      <div className="h-safe-bottom-extra sm:h-3.5" />
    </div>
  );
}

export default LockersMyLockerBar;
