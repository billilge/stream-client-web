import { Skeleton } from "@wanteddev/wds";

import { useSkeletonAnimation } from "@/components/ui/ScreenSkeleton";
import CalendarsDateGrid from "@/features/calendars/components/CalendarsDateGrid";

interface HomeCalendarWeekSkeletonProps {
  weekDates: string[];
  today: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}

// 날짜는 일정과 상관없어서 점 없이 그대로 그리고, 일정 카드 한 장(62px: 위아래 12 + 제목 18 + 4 + 기간 16) 자리만 채운다.
function HomeCalendarWeekSkeleton({
  weekDates,
  today,
  selectedDate,
  onSelect,
}: HomeCalendarWeekSkeletonProps) {
  const animation = useSkeletonAnimation();

  return (
    <>
      <CalendarsDateGrid
        onSelect={onSelect}
        selectedDate={selectedDate}
        size="weekly"
        today={today}
        weeks={[weekDates]}
      />
      <Skeleton
        animation={animation}
        height="62px"
        radius="12px"
        variant="rectangle"
        width="100%"
      />
    </>
  );
}

export default HomeCalendarWeekSkeleton;
