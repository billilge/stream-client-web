import { Typography } from "@wanteddev/wds";
import type { ReactNode } from "react";

import lockerUnavailableIcon from "@/assets/icons/lockers/locker-unavailable.svg";

function LegendItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <Typography
        as="p"
        color="semantic.label.alternative"
        sx={{ whiteSpace: "nowrap" }}
        variant="caption2"
        weight="regular"
      >
        {label}
      </Typography>
    </div>
  );
}

interface LockersLockerLegendProps {
  /** 보기 전용(내 사물함 화면)이면 내 칸 표시만 알려준다 */
  isViewOnly?: boolean;
}

// Figma: Legend (nodeId 2159:110814) — Stream 로컬. 칸 색이 무엇을 뜻하는지 알려준다.
function LockersLockerLegend({ isViewOnly = false }: LockersLockerLegendProps) {
  if (isViewOnly) {
    return (
      <div className="flex flex-col gap-2">
        <LegendItem
          icon={<span className="size-3.75 rounded-xs bg-primary" />}
          label="내 사물함"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <LegendItem
        icon={<span className="size-[15px] rounded-[2px] bg-orange-95" />}
        label="선택 가능"
      />
      <LegendItem
        icon={
          <img alt="" className="size-[15px]" src={lockerUnavailableIcon} />
        }
        label="선택 불가"
      />
    </div>
  );
}

export default LockersLockerLegend;
