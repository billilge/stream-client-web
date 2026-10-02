import {
  WheelPicker,
  type WheelPickerClassNames,
  type WheelPickerOption,
  WheelPickerWrapper,
} from "@ncdai/react-wheel-picker";
import { ActionArea, ActionAreaButton, Typography } from "@wanteddev/wds";
import { IconCircleInfo } from "@wanteddev/wds-icon";
import { useEffect, useState } from "react";

import BottomSheet from "@/components/ui/BottomSheet";
import BililgeItemCard from "@/features/bililge/components/BililgeItemCard";
import BililgeRentalConfirmModal from "@/features/bililge/components/BililgeRentalConfirmModal";
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

// 칸 사이 세로 간격(행 간 pitch)이 Figma보다 좁아 보인다는 QA 지적(디자인 QA 페이지
// nodeId 2849:56598의 "빌릴게 대여 바텀시트" 비교 항목, 구현 스크린샷의 오전-오후 사이에
// 빨간 화살표로 표시됨) — 기존 24는 선택 안 된 줄의 텍스트 블록 높이(17px 폰트 × line-height
// 1.412 ≈ 24)를 그대로 가져다 쓴 값이라, 실제 Figma의 줄 간 pitch(선택 줄 높이 26 + gap 6 +
// 비선택 줄 높이 24를 반씩 걸쳐 계산하면 ≈31px, Time Picker 스크린샷에서 실측해도 31px)보다
// 작았다. WheelPicker 기본값(30)에 더 가까운 이 값으로 세 컬럼 모두 맞춘다.
const OPTION_ITEM_HEIGHT = 31;

// 선택되지 않은 칸은 옅게, 가운데 선택된 칸만 진하게 — 배경 하이라이트 바는 Time Picker 쪽에서
// 3개 컬럼 공통으로 하나 깔아주기 때문에 여기서는 텍스트 스타일만 다룬다.
// 여기는 @ncdai/react-wheel-picker가 className 문자열만 받아서 자기 DOM에 그대로 꽂는 자리라
// <Typography>로 감쌀 수 없다 — Headline2/Medium(17px)·Headline1/Bold(18px)를 그대로 옮긴 값이다.
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

// 확인 모달의 "대여 시작 시간" 행에 쓰는 문구 — 분은 휠 피커에 보이는 표기(0 패딩)와 맞춘다.
function formatTimeLabel(time: {
  period: Period;
  hour: number;
  minute: number;
}): string {
  return `${time.period} ${time.hour}시 ${String(time.minute).padStart(2, "0")}분`;
}

// Figma: 빌릴게 대여 바텀시트 (nodeId 1422:57155) 안의 Views / Bottom Sheets (1422:57176).
// 대여할 물품(수량 스테퍼) + 대여 시작 시간(휠 피커) + 안내문 + 대여 신청하기 버튼으로 구성된다.
// 대여 가능 시간 검증(대여가능 시간 아닐 때/점심시간 등 Figma의 다른 상태 프레임)은 백엔드 연동
// 전이라 이번 구현 범위에서 뺐다.
function BililgeRentalSheet({ item, open, onClose }: BililgeRentalSheetProps) {
  const [stepperValue, setStepperValue] = useState(1);
  const [time, setTime] = useState(getDefaultStartTime);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (item) {
      setStepperValue(1);
      setTime(getDefaultStartTime());
      setConfirmOpen(false);
    }
  }, [item]);

  const handleConfirm = () => {
    setConfirmOpen(false);
    onClose();
  };

  return (
    <BottomSheet onClose={onClose} open={open}>
      {item && (
        <div className="flex flex-col gap-7 px-5">
          <div className="flex flex-col gap-3">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="headline2"
              weight="bold"
            >
              대여할 물품
            </Typography>
            <BililgeItemCard
              icon={item.icon}
              itemName={item.name}
              onStepperDecrease={() =>
                setStepperValue((value) => Math.max(1, value - 1))
              }
              onStepperIncrease={() =>
                setStepperValue((value) => Math.min(item.quantity, value + 1))
              }
              // Figma: 대여할 물품 카드(nodeId 1422:57184, 3013:114608)에 "수량 28 · 오늘
              // 17시까지 반납" / "수량 28 · 9/29까지 반납"처럼 수량 뒤에 반납 기한이 강조
              // 서체(SemiBold)로 붙는다 — 기한 라벨(returnDeadlineLabel)은 서버가 오늘/내일/
              // 날짜를 미리 판단해 내려주는 완성된 문자열이라 여기서는 이어붙이기만 한다.
              stepperValue={stepperValue}
              subtitle={`수량 ${item.quantity} · `}
              subtitleEmphasis={item.returnDeadlineLabel}
              trailingControl="stepper"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Typography
              as="p"
              color="semantic.label.normal"
              variant="headline2"
              weight="bold"
            >
              대여 시작 시간
            </Typography>
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 h-[38px] -translate-y-1/2 rounded-xl bg-background-alternative" />
              <WheelPickerWrapper className="relative justify-center gap-7">
                <div className="w-8">
                  <WheelPicker
                    classNames={WHEEL_CLASS_NAMES}
                    onValueChange={(period) =>
                      setTime((prev) => ({ ...prev, period }))
                    }
                    optionItemHeight={OPTION_ITEM_HEIGHT}
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
                    optionItemHeight={OPTION_ITEM_HEIGHT}
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
                    optionItemHeight={OPTION_ITEM_HEIGHT}
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
            <Typography
              as="p"
              color="semantic.primary.normal"
              variant="caption1"
              weight="medium"
            >
              대여 시작 시간은 최소 5분 뒤부터 선택할 수 있어요
            </Typography>
          </div>
        </div>
      )}

      <ActionArea>
        {/* Figma Main Action(1422:...;16215:35710)은 56px인데 ActionAreaButton의 size="large"
            Button은 padding(12px×2)+body1 line-height(24px)라 48px이 된다. WDS Button엔 large보다
            큰 사이즈가 없어 sx로 높이만 보정한다. */}
        <ActionAreaButton
          onClick={() => setConfirmOpen(true)}
          sx={{ height: "56px" }}
        >
          대여 신청하기
        </ActionAreaButton>
      </ActionArea>
      {item && (
        <BililgeRentalConfirmModal
          itemName={item.name}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirm}
          open={confirmOpen}
          quantity={stepperValue}
          timeLabel={formatTimeLabel(time)}
        />
      )}
    </BottomSheet>
  );
}

export default BililgeRentalSheet;
