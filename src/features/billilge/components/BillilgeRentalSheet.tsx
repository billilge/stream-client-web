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
import BillilgeItemCard from "@/features/billilge/components/BillilgeItemCard";
import BillilgeRentalConfirmModal from "@/features/billilge/components/BillilgeRentalConfirmModal";
import { useBillilgeRentalApply } from "@/features/billilge/hooks/useBillilgeRentalApply";
import { BILLILGE_ERROR_CODES } from "@/shared/entities/billilge/billilgeQueries";
import type { BillilgeItem } from "@/shared/entities/billilge/billilgeTypes";

interface BillilgeRentalSheetProps {
  item: BillilgeItem | null;
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

interface RentalTime {
  period: Period;
  hour: number;
  minute: number;
}

// 대여 시작 시각은 지금부터 이만큼 뒤부터 고를 수 있다(서버 RentalTimeValidator와 같은 값)
const MIN_LEAD_MINUTES = 5;

function getDefaultStartTime(base: Date = new Date()): RentalTime {
  const now = new Date(base.getTime() + MIN_LEAD_MINUTES * 60 * 1000);
  const hour24 = now.getHours();
  const period: Period = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour: hour12, minute: now.getMinutes(), period };
}

// 휠의 오전/오후·1~12시를 서버가 받는 0~23시로 바꾼다 — 오전 12시는 0시, 오후 12시는 12시다
function toHour24({ period, hour }: RentalTime): number {
  return (hour % 12) + (period === "오후" ? 12 : 0);
}

type RentalTimeError = "range" | "lunch" | "tooSoon";

// 서버 RentalTimeValidator와 같은 순서·기준으로 판정한다 — 앞에서 걸리면 뒤는 보지 않아서, 서버가 거절할 때 주는
// 코드와 화면이 고르는 문구가 같다. 날짜는 늘 오늘이라 시각만 비교한다.
function getRentalTimeError(
  time: RentalTime,
  now: Date,
): RentalTimeError | null {
  const minutes = toHour24(time) * 60 + time.minute;
  // 영업시간 10:00~17:00(17:00 포함)
  if (minutes < 10 * 60 || minutes > 17 * 60) {
    return "range";
  }
  // 점심시간 12:00~12:59
  if (minutes >= 12 * 60 && minutes < 13 * 60) {
    return "lunch";
  }
  // 지금(초 버림) + 5분보다 이르면 안 된다
  if (minutes - MIN_LEAD_MINUTES < now.getHours() * 60 + now.getMinutes()) {
    return "tooSoon";
  }
  return null;
}

// 서버가 대여 시각을 거절한 코드 → 화면 판정. 같은 규칙이라 화면도 같은 상태로 보여 준다
const SERVER_RENTAL_TIME_ERRORS: Partial<Record<string, RentalTimeError>> = {
  [BILLILGE_ERROR_CODES.timeOutOfRange]: "range",
  [BILLILGE_ERROR_CODES.timeLunchBreak]: "lunch",
  [BILLILGE_ERROR_CODES.timeTooSoon]: "tooSoon",
};

// Figma 대여가능 시간 아닐 때(1422:57207)·점심시간에 대여 불가(1422:57238) — 서버 RentalErrorCode와 같은 문구다.
// 5분 안쪽은 따로 문구를 띄우지 않고 늘 보이는 안내 줄("최소 5분 뒤부터…")로 알린다.
const RENTAL_TIME_ERROR_MESSAGES = {
  range: "대여 가능 시간이 아니에요. 10시-17시 사이로 선택해 주세요.",
  lunch: "점심시간(12시-13시)에는 대여가 불가능해요.",
} as const;

// 시트를 띄워 둔 사이 시각이 지나도 "5분 뒤" 판정이 따라오게, 열려 있는 동안 분이 바뀔 때마다 지금 시각을 갱신한다
function useCurrentMinute(isActive: boolean): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isActive) {
      return;
    }
    setNow(new Date());
    let intervalId: number | undefined;
    // 다음 분이 시작될 때 한 번 맞추고, 그 뒤로는 1분마다 갱신한다
    const timeoutId = window.setTimeout(
      () => {
        setNow(new Date());
        intervalId = window.setInterval(() => setNow(new Date()), 60 * 1000);
      },
      60 * 1000 - (Date.now() % (60 * 1000)),
    );
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isActive]);

  return now;
}

// 확인 모달의 "대여 시작 시간" 행에 쓰는 문구 — 분은 휠 피커에 보이는 표기(0 패딩)와 맞춘다.
function formatTimeLabel(time: RentalTime): string {
  return `${time.period} ${time.hour}시 ${String(time.minute).padStart(2, "0")}분`;
}

// Figma: 빌릴게 대여 바텀시트 (nodeId 1422:57155) 안의 Views / Bottom Sheets (1422:57176).
// 대여할 물품(수량 스테퍼) + 대여 시작 시간(휠 피커) + 안내문 + 대여 신청하기 버튼으로 구성된다.
// 고른 시각을 쓸 수 없으면 "대여 신청하기"가 막힌다 — 영업시간 밖·점심시간은 안내 줄이 빨간 문구로 바뀌고
// (1422:57207·1422:57238), 5분 안쪽은 안내 줄 그대로다.
function BillilgeRentalSheet({
  item,
  open,
  onClose,
}: BillilgeRentalSheetProps) {
  const [stepperValue, setStepperValue] = useState(1);
  const [time, setTime] = useState(getDefaultStartTime);
  // 서버가 이 시각을 거절했다 — 기기 시계가 어긋나 화면 판정과 다를 수 있어서, 시각을 다시 고르기 전까지 서버 판정을 따른다
  const [serverTimeError, setServerTimeError] =
    useState<RentalTimeError | null>(null);
  const now = useCurrentMinute(open);
  const timeError = serverTimeError ?? getRentalTimeError(time, now);
  const timeErrorMessage =
    timeError === "range" || timeError === "lunch"
      ? RENTAL_TIME_ERROR_MESSAGES[timeError]
      : null;
  // 휠로 시각을 직접 골랐는지 — 고르기 전에는 기본값(지금+5분)이 시계를 따라간다
  const [isTimePicked, setIsTimePicked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { apply, applyDialogs, isApplying } = useBillilgeRentalApply({
    closeSheet: onClose,
    onTimeRejected: (code) =>
      setServerTimeError(SERVER_RENTAL_TIME_ERRORS[code] ?? "range"),
  });

  // 같은 물품을 다시 열어도(item이 그대로) 시각은 지금 기준으로 다시 채운다 — 전에 열었을 때의 기본값은
  // 이미 "5분 뒤"가 아닐 수 있다
  useEffect(() => {
    if (open && item) {
      setStepperValue(1);
      setTime(getDefaultStartTime());
      setIsTimePicked(false);
      setServerTimeError(null);
      setConfirmOpen(false);
    }
  }, [open, item]);

  // 기본값은 딱 5분 뒤라 시트를 띄워 둔 사이 분이 바뀌면 바로 5분 규칙에 걸린다. 직접 고르기 전에는 분이 바뀔 때마다
  // 기본값을 다시 채워서, 아무것도 안 했는데 "대여 신청하기"가 막히지 않게 한다. 직접 고른 시각은 건드리지 않는다
  useEffect(() => {
    if (open && !isTimePicked) {
      setTime(getDefaultStartTime(now));
    }
  }, [open, isTimePicked, now]);

  const changeTime = (next: Partial<RentalTime>) => {
    setTime((prev) => ({ ...prev, ...next }));
    setIsTimePicked(true);
    setServerTimeError(null);
  };

  // 확인 모달은 바로 닫고 시트의 "대여 신청하기"가 로딩을 보인다 — 시각이 거절되면 시트에 남아 고칠 수 있다
  const handleConfirm = () => {
    if (!item) {
      return;
    }
    setConfirmOpen(false);
    apply({
      count: stepperValue,
      ignoreDuplicate: false,
      itemId: item.itemId,
      rentAtHour: toHour24(time),
      rentAtMinute: time.minute,
    });
  };

  return (
    <>
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
              <BillilgeItemCard
                icon={item.imageUrl}
                itemName={item.name}
                onStepperDecrease={() =>
                  setStepperValue((value) => Math.max(1, value - 1))
                }
                onStepperIncrease={() =>
                  setStepperValue((value) => Math.min(item.count, value + 1))
                }
                // Figma: 대여할 물품 카드(nodeId 1422:57184, 3013:114608)에 "수량 28 · 오늘
                // 17시까지 반납" / "수량 28 · 9/29까지 반납"처럼 수량 뒤에 반납 기한이 강조
                // 서체(SemiBold)로 붙는다 — 기한 라벨(returnDeadlineLabel)은 서버가 오늘/내일/
                // 날짜를 미리 판단해 내려주는 완성된 문자열이라 여기서는 이어붙이기만 한다.
                // 돌려받지 않는 소모품은 라벨이 없어 수량만 보인다.
                stepperValue={stepperValue}
                subtitle={
                  item.returnDeadlineLabel
                    ? `수량 ${item.count} · `
                    : `수량 ${item.count}`
                }
                subtitleEmphasis={item.returnDeadlineLabel ?? undefined}
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
                      onValueChange={(period) => changeTime({ period })}
                      optionItemHeight={OPTION_ITEM_HEIGHT}
                      options={PERIOD_OPTIONS}
                      value={time.period}
                      visibleCount={12}
                    />
                  </div>
                  <div className="w-7">
                    <WheelPicker
                      classNames={WHEEL_CLASS_NAMES}
                      onValueChange={(hour) => changeTime({ hour })}
                      optionItemHeight={OPTION_ITEM_HEIGHT}
                      options={HOUR_OPTIONS}
                      value={time.hour}
                      visibleCount={12}
                    />
                  </div>
                  <div className="w-7">
                    <WheelPicker
                      classNames={WHEEL_CLASS_NAMES}
                      onValueChange={(minute) => changeTime({ minute })}
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
              <IconCircleInfo
                className={`size-5 shrink-0 ${timeErrorMessage ? "text-status-negative" : "text-primary"}`}
              />
              <Typography
                as="p"
                color={
                  timeErrorMessage
                    ? "semantic.status.negative"
                    : "semantic.primary.normal"
                }
                variant="caption1"
                weight="medium"
              >
                {timeErrorMessage ??
                  "대여 시작 시간은 최소 5분 뒤부터 선택할 수 있어요"}
              </Typography>
            </div>
          </div>
        )}

        <ActionArea>
          {/* Figma Main Action(1422:...;16215:35710)은 56px인데 ActionAreaButton의 size="large"
            Button은 padding(12px×2)+body1 line-height(24px)라 48px이 된다. WDS Button엔 large보다
            큰 사이즈가 없어 sx로 높이만 보정한다. */}
          <ActionAreaButton
            disabled={timeError !== null}
            loading={isApplying}
            onClick={() => setConfirmOpen(true)}
            sx={{ height: "56px" }}
          >
            대여 신청하기
          </ActionAreaButton>
        </ActionArea>
        {item && (
          <BillilgeRentalConfirmModal
            itemName={item.name}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleConfirm}
            open={confirmOpen}
            quantity={stepperValue}
            timeLabel={formatTimeLabel(time)}
          />
        )}
      </BottomSheet>
      {/* 시트가 닫힌 뒤에 뜨는 결과 토스트·중복 신청 확인 모달이라 시트 밖에 둔다 */}
      {applyDialogs}
    </>
  );
}

export default BillilgeRentalSheet;
