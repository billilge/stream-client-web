import {
  DatePicker,
  type DatePickerFieldProps,
  type DateType,
  Typography,
} from "@wanteddev/wds";
import { IconChevronDown } from "@wanteddev/wds-icon";
import { createContext, use, useRef, useState } from "react";

import {
  formatYearMonth,
  toDateString,
} from "@/features/calendars/utils/calendarDates";

interface CalendarsMonthPickerTriggerValue {
  label: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// DatePicker는 input prop으로 받은 컴포넌트에 입력칸 편집용 props(입력값·커서 이동 핸들러 등)만 넘겨서,
// 제목 문구와 여닫기는 context로 건넨다.
const CalendarsMonthPickerTriggerContext =
  createContext<CalendarsMonthPickerTriggerValue | null>(null);

// 입력칸 대신 그리는 "2026년 11월 ⌄" — DatePicker가 넘기는 ref만 달아서 팝오버가 이 자리 아래에 붙는다.
// 열린 채로 다시 누르면 DatePicker가 팝오버 밖을 눌렀다고(포커스가 밖으로 나갔다고) 먼저 닫아서, 클릭 때 지금 상태로
// 뒤집으면 다시 열린다. 그래서 누르기 시작한 순간(pointerdown)의 상태를 기억했다가 그 반대로 바꾼다.
// 키보드로 누르면 pointerdown이 없어서 지금 상태를 뒤집는다.
function CalendarsMonthPickerTrigger({ ref }: DatePickerFieldProps) {
  const trigger = use(CalendarsMonthPickerTriggerContext);
  const wasOpenOnPressRef = useRef<boolean | null>(null);
  if (!trigger) {
    return null;
  }

  const handleClick = () => {
    trigger.onOpenChange(!(wasOpenOnPressRef.current ?? trigger.isOpen));
    wasOpenOnPressRef.current = null;
  };

  return (
    <div className="flex min-w-0 flex-1" ref={ref}>
      <button
        aria-expanded={trigger.isOpen}
        aria-haspopup="dialog"
        aria-label={`${trigger.label}, 날짜 고르기`}
        className="flex items-center gap-1.5"
        onClick={handleClick}
        onPointerDown={() => {
          wasOpenOnPressRef.current = trigger.isOpen;
        }}
        type="button"
      >
        <Typography
          as="span"
          color="semantic.label.normal"
          variant="heading2"
          weight="bold"
        >
          {trigger.label}
        </Typography>
        <IconChevronDown className="size-4.5 text-label-normal" />
      </button>
    </div>
  );
}

// 연·월 선택 화면이 Figma에 없어서, 제목 옆 ⌄를 누르면 WDS DatePicker 달력 팝오버로 특정 날짜를 고른다.
// 달력 머리를 누르면 연 → 월 → 일 순서로 고를 수 있게 세 단계를 모두 켠다(기본값은 연·일뿐이다).
const PICKER_VIEWS: ("year" | "month" | "day")[] = ["year", "month", "day"];

interface CalendarsMonthPickerProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

function CalendarsMonthPicker({
  selectedDate,
  onSelect,
}: CalendarsMonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChangeComplete = (value: DateType) => {
    if (value) {
      onSelect(toDateString(new Date(value)));
    }
  };

  return (
    <CalendarsMonthPickerTriggerContext
      value={{
        isOpen,
        label: formatYearMonth(selectedDate),
        onOpenChange: setIsOpen,
      }}
    >
      <DatePicker
        input={CalendarsMonthPickerTrigger}
        onChangeComplete={handleChangeComplete}
        onOpenChange={setIsOpen}
        open={isOpen}
        // Date로 넘기면 렌더마다 새 값이라 DatePicker가 입력값을 다시 맞추며 렌더를 반복해서 문자열로 넘긴다
        value={selectedDate}
        views={PICKER_VIEWS}
      />
    </CalendarsMonthPickerTriggerContext>
  );
}

export default CalendarsMonthPicker;
