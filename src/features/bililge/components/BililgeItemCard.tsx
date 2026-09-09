// Figma: Rental Item Card (nodeId 1041:61407)
import { Button } from "@wanteddev/wds";

import circleMinusFill from "@/assets/icons/circle-minus-fill.svg";
import circlePlusFill from "@/assets/icons/circle-plus-fill.svg";

interface BililgeItemCardProps {
  icon: string;
  itemName: string;
  quantity: number;
  trailingControl?: "button" | "stepper";
  onRentRequest?: () => void;
  stepperValue?: number;
  onStepperDecrease?: () => void;
  onStepperIncrease?: () => void;
}

// "대여 신청" 버튼은 Figma상 `Menu/Resource/Action Area/Trailing Content/Button`(WDS) 인스턴스지만,
// 그 이름과 1:1 대응하는 코드 export는 없다 — 대신 WDS `Button`(size="small")이 padding(7px/14px)·
// radius(8px)·타이포(label2)까지 정확히 일치해서 그걸 쓰고, Button 공개 variant엔 없는 "연한 파랑 배경
// + 파랑 텍스트" 조합만 sx로 보정했다. 스테퍼 +/- 아이콘은 여전히 WDS 미확정이라 하드코딩 — docs/plans 참고.
function BililgeItemCard({
  icon,
  itemName,
  quantity,
  trailingControl = "button",
  onRentRequest,
  stepperValue = 1,
  onStepperDecrease,
  onStepperIncrease,
}: BililgeItemCardProps) {
  const isStepper = trailingControl === "stepper";

  return (
    <div
      className={`flex w-[335px] items-center rounded-xl bg-background-normal p-4 ${isStepper ? "border border-line-solid-neutral" : ""}`}
    >
      <div className="flex h-[42px] w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <img alt="" className="size-[42px]" src={icon} />
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-label-normal text-sm">
              {itemName}
            </p>
            <p className="text-label-alternative text-xs">수량 {quantity}</p>
          </div>
        </div>

        {!isStepper && (
          <Button
            color="primary"
            onClick={onRentRequest}
            size="small"
            sx={{
              backgroundColor: "var(--color-primary-subtle)",
              color: "var(--color-primary)",
            }}
            variant="solid"
          >
            대여 신청
          </Button>
        )}

        {isStepper && (
          <div className="flex items-center gap-4">
            <button
              aria-label="수량 감소"
              onClick={onStepperDecrease}
              type="button"
            >
              <img alt="" className="size-6" src={circleMinusFill} />
            </button>
            <span className="font-semibold text-label-normal text-lg">
              {stepperValue}
            </span>
            <button
              aria-label="수량 증가"
              onClick={onStepperIncrease}
              type="button"
            >
              <img alt="" className="size-6" src={circlePlusFill} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BililgeItemCard;
