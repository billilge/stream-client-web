import { Typography } from "@wanteddev/wds";
import { IconChevronLeft, IconChevronRight } from "@wanteddev/wds-icon";
import { Suspense, useDeferredValue, useState } from "react";

import arrowRight from "@/assets/icons/common/arrow-right.svg";
import {
  addDays,
  formatWeekRange,
  getToday,
  getWeekDates,
  getWeekStart,
} from "@/features/calendars/utils/calendarDates";
import HomeCalendarWeek from "@/features/home/components/HomeCalendarWeek";
import HomeCalendarWeekSkeleton from "@/features/home/components/HomeCalendarWeekSkeleton";

// 보고 있는 주(일요일)와 고른 날짜. 고른 날짜는 늘 보고 있는 주 안에 있어서, 둘을 한 상태로 같이 바꾼다
interface HomeCalendarView {
  weekStart: string;
  selectedDate: string;
}

interface HomeCalendarSectionProps {
  /** 우상단 › → 학사 일정 상세(오늘) */
  onOpen: () => void;
  /** N건 더보기 → 고른 날짜로 학사 일정 상세 */
  onMore: (date: string) => void;
}

// Figma: 학사일정 · 주간 (nodeId 5365:90592), 홈 주간 캘린더 추가ver (5365:90496)
// 카드 라운드는 Figma가 이 카드만 16px(radius 변수)로 그렸다.
function HomeCalendarSection({ onOpen, onMore }: HomeCalendarSectionProps) {
  const [today] = useState(getToday);
  const [view, setView] = useState<HomeCalendarView>(() => ({
    selectedDate: today,
    weekStart: getWeekStart(today),
  }));
  // 주를 옮기면 새 주의 일정을 받는 동안 지금 주를 띄워 둔다 — 스켈레톤으로 깜빡이지 않고 받은 뒤 한 번에 바뀐다
  const deferredView = useDeferredValue(view);
  const weekDates = getWeekDates(deferredView.weekStart);

  const moveWeek = (weeks: number) => {
    const weekStart = addDays(view.weekStart, weeks * 7);
    setView({
      selectedDate: getWeekStart(today) === weekStart ? today : weekStart,
      weekStart,
    });
  };
  const selectDate = (selectedDate: string) =>
    setView((current) => ({ ...current, selectedDate }));

  const weekProps = {
    onSelect: selectDate,
    selectedDate: deferredView.selectedDate,
    today,
    weekDates,
  };

  return (
    <section
      aria-label="학사 일정"
      className="flex flex-col gap-3 rounded-2xl bg-background-normal p-4"
    >
      {/* Figma 폭(79px)으로 고정하면 "11.22 – 11.28"처럼 넓은 주가 두 줄로 꺾여서 최소 폭으로만 둔다 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            aria-label="지난주"
            className="text-label-normal"
            onClick={() => moveWeek(-1)}
            type="button"
          >
            <IconChevronLeft className="size-4" />
          </button>
          <span className="min-w-19.75 whitespace-nowrap text-center">
            <Typography
              as="span"
              color="semantic.label.normal"
              variant="label1"
              weight="bold"
            >
              {formatWeekRange(deferredView.weekStart)}
            </Typography>
          </span>
          <button
            aria-label="다음 주"
            className="text-label-normal"
            onClick={() => moveWeek(1)}
            type="button"
          >
            <IconChevronRight className="size-4" />
          </button>
        </div>
        <button aria-label="학사 일정 전체 보기" onClick={onOpen} type="button">
          <img alt="" className="-mr-1 size-3" src={arrowRight} />
        </button>
      </div>
      <Suspense fallback={<HomeCalendarWeekSkeleton {...weekProps} />}>
        <HomeCalendarWeek {...weekProps} onMore={onMore} />
      </Suspense>
    </section>
  );
}

export default HomeCalendarSection;
