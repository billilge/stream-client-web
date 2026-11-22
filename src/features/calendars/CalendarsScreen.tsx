import { TopNavigationButton } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";
import { Suspense, useDeferredValue, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ScreenBottomSafeArea from "@/components/ui/ScreenBottomSafeArea";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { useScreenHeader } from "@/components/ui/useScreenHeader";
import CalendarsMonthContent from "@/features/calendars/components/CalendarsMonthContent";
import CalendarsMonthPicker from "@/features/calendars/components/CalendarsMonthPicker";
import CalendarsMonthSkeleton from "@/features/calendars/components/CalendarsMonthSkeleton";
import { CALENDARS_DATE_PARAM } from "@/features/calendars/constants/calendars";
import {
  addMonths,
  getMonthStart,
  getMonthWeeks,
  getToday,
  isDateString,
} from "@/features/calendars/utils/calendarDates";
import { HOME_PATH } from "@/features/home/constants/home";
import { useBackNavigation } from "@/hooks/useBackNavigation";

// 보고 있는 달과 고른 날짜. 고른 날짜는 늘 보고 있는 달 안에 있어서, 둘을 한 상태로 같이 바꾼다
interface CalendarsView {
  monthStart: string;
  selectedDate: string;
}

// Figma: 학사일정 상세 (nodeId 5365:90635), 일정 없음 (5365:90711)
// 주소에 날짜(?date=)가 있으면 그 날짜를, 없으면 오늘을 고른 채로 연다.
function CalendarsScreen() {
  const goBack = useBackNavigation(HOME_PATH);
  const [searchParams] = useSearchParams();
  const [today] = useState(getToday);
  const [view, setView] = useState<CalendarsView>(() => {
    const requestedDate = searchParams.get(CALENDARS_DATE_PARAM);
    const selectedDate =
      requestedDate && isDateString(requestedDate) ? requestedDate : today;
    return { monthStart: getMonthStart(selectedDate), selectedDate };
  });
  // 달을 옮기면 새 달의 일정을 받는 동안 지금 달을 띄워 둔다 — 스켈레톤으로 깜빡이지 않고 받은 뒤 한 번에 바뀐다
  const deferredView = useDeferredValue(view);
  const weeks = getMonthWeeks(deferredView.monthStart);

  useScreenHeader(
    <ScreenHeader
      leading={
        <TopNavigationButton
          aria-label="뒤로가기"
          onClick={goBack}
          variant="icon"
        >
          <IconChevronLeft />
        </TopNavigationButton>
      }
      title="학사 일정"
      variant="normal"
    />,
  );

  const selectDate = (selectedDate: string) =>
    setView({ monthStart: getMonthStart(selectedDate), selectedDate });

  const moveMonth = (months: number) => {
    const monthStart = addMonths(view.monthStart, months);
    setView({
      monthStart,
      selectedDate: getMonthStart(today) === monthStart ? today : monthStart,
    });
  };

  const contentProps = {
    monthStart: deferredView.monthStart,
    onSelect: selectDate,
    selectedDate: deferredView.selectedDate,
    today,
    weeks,
  };

  return (
    <div className="scrollbar-hidden h-full overflow-y-auto">
      <div className="flex flex-col gap-5 pb-4">
        <div className="flex items-center gap-3 px-5">
          <CalendarsMonthPicker
            onSelect={selectDate}
            selectedDate={deferredView.selectedDate}
          />
          <button
            aria-label="이전 달"
            className="text-label-normal"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            <IconChevronLeft className="size-5" />
          </button>
          <button
            aria-label="다음 달"
            className="text-label-normal"
            onClick={() => moveMonth(1)}
            type="button"
          >
            <IconChevronRight className="size-5" />
          </button>
        </div>
        <Suspense fallback={<CalendarsMonthSkeleton {...contentProps} />}>
          <CalendarsMonthContent {...contentProps} />
        </Suspense>
      </div>
      <ScreenBottomSafeArea />
    </div>
  );
}

export default CalendarsScreen;
