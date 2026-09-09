import {
  WheelPicker,
  type WheelPickerClassNames,
  type WheelPickerOption,
  WheelPickerWrapper,
} from "@ncdai/react-wheel-picker";
import { ActionArea, ActionAreaButton } from "@wanteddev/wds";
import { IconCircleInfo } from "@wanteddev/wds-icon";
import { useEffect, useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import type { BililgeItem } from "@/features/bililge/constants/bililgeItems";

interface BililgeRentalSheetProps {
  item: BililgeItem | null;
  open: boolean;
  onClose: () => void;
}

type Period = "오전" | "오후";

const PERIOD_OPTIONS: WheelPickerOption<Period>[] = [
  { label: "오전", value: "오전" },
  { label: "오후", value: "오후" },
];

const HOUR_OPTIONS: WheelPickerOption<number>[] = Array.from(
  { length: 12 },
  (_, i) => ({ label: String(i + 1), value: i + 1 }),
);

const MINUTE_OPTIONS: WheelPickerOption<number>[] = Array.from(
  { length: 60 },
  (_, i) => ({ label: String(i).padStart(2, "0"), value: i }),
);

// 선택되지 않은 칸은 옅게, 가운데 선택된 칸만 진하게 — 배경 하이라이트 바는 Time Picker 쪽에서
// 3개 컬럼 공통으로 하나 깔아주기 때문에 여기서는 텍스트 스타일만 다룬다.
const WHEEL_CLASS_NAMES: WheelPickerClassNames = {
  highlightItem: "font-semibold text-label-normal text-lg tabular-nums",
  // 뒤쪽 옵션 리스트(회색)가 하이라이트 리스트(진한 글자)에 그대로 비쳐서 겹쳐 보이는 문제 —
  // 배경색을 채워서 가운데 줄만큼은 회색 글자를 완전히 가려야 한다. 공유 pill과 같은 색이라
  // 컬럼 사이 gap에서 보이는 pill과 이어져서 하나의 막대처럼 보인다.
  highlightWrapper: "bg-background-alternative",
  optionItem: "font-medium text-[17px] text-label-disable tabular-nums",
};

function getDefaultStartTime(): {
  period: Period;
  hour: number;
  minute: number;
} {
  const now = new Date(Date.now() + 5 * 60 * 1000);
  const hour24 = now.getHours();
  const period: Period = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour: hour12, minute: now.getMinutes(), period };
}

// Figma: 빌릴게 대여 바텀시트 (nodeId 1422:57155) 안의 Views / Bottom Sheets (1422:57176).
// 대여할 물품(수량 스테퍼) + 대여 시작 시간(휠 피커) + 안내문 + 대여 신청하기 버튼으로 구성된다.
// 대여 가능 시간 검증(대여가능 시간 아닐 때/점심시간 등 Figma의 다른 상태 프레임)은 백엔드 연동
// 전이라 이번 구현 범위에서 뺐다.
function BililgeRentalSheet({ item, open, onClose }: BililgeRentalSheetProps) {
  const [stepperValue, setStepperValue] = useState(1);
  const [time, setTime] = useState(getDefaultStartTime);

  useEffect(() => {
    if (item) {
      setStepperValue(1);
      setTime(getDefaultStartTime());
    }
  }, [item]);

  return (
    <BottomSheet onClose={onClose} open={open}>
      {item && (
        <div className="flex flex-col gap-7 px-5">
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-[17px] text-label-normal">
              대여할 물품
            </p>
            <BililgeItemCard
              icon={item.icon}
              itemName={item.name}
              onStepperDecrease={() =>
                setStepperValue((value) => Math.max(1, value - 1))
              }
              onStepperIncrease={() =>
                setStepperValue((value) => Math.min(item.quantity, value + 1))
              }
              quantity={item.quantity}
              stepperValue={stepperValue}
              trailingControl="stepper"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[17px] text-label-normal">
              대여 시작 시간
            </p>
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-[38px] -translate-y-1/2 rounded-xl bg-background-alternative" />
              <WheelPickerWrapper className="relative justify-center gap-7">
                <div className="w-8">
                  <WheelPicker
                    classNames={WHEEL_CLASS_NAMES}
                    onValueChange={(period) =>
                      setTime((prev) => ({ ...prev, period }))
                    }
                    optionItemHeight={24}
                    options={PERIOD_OPTIONS}
                    value={time.period}
                    visibleCount={12}
                  />
                </div>
                <div className="w-7">
                  <WheelPicker
                    classNames={WHEEL_CLASS_NAMES}
                    onValueChange={(hour) =>
                      setTime((prev) => ({ ...prev, hour }))
                    }
                    optionItemHeight={24}
                    options={HOUR_OPTIONS}
                    value={time.hour}
                    visibleCount={12}
                  />
                </div>
                <div className="w-7">
                  <WheelPicker
                    classNames={WHEEL_CLASS_NAMES}
                    onValueChange={(minute) =>
                      setTime((prev) => ({ ...prev, minute }))
                    }
                    optionItemHeight={24}
                    options={MINUTE_OPTIONS}
                    value={time.minute}
                    visibleCount={12}
                  />
                </div>
              </WheelPickerWrapper>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconCircleInfo className="size-5 shrink-0 text-primary" />
            <p className="text-primary text-xs">
              대여 시작 시간은 최소 5분 뒤부터 선택할 수 있어요
            </p>
          </div>
        </div>
      )}

      <ActionArea>
        <ActionAreaButton onClick={onClose}>대여 신청하기</ActionAreaButton>
      </ActionArea>
    </BottomSheet>
  );
}

export default BililgeRentalSheet;
