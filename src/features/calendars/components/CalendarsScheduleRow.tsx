import { Typography } from "@wanteddev/wds";

import { formatSchedulePeriod } from "@/features/calendars/utils/calendarDates";
import type { CalendarSchedule } from "@/shared/entities/calendars/calendarsTypes";

interface CalendarsScheduleRowProps {
  schedule: CalendarSchedule;
}

// Figma: Calendar/Event row (nodeId 5148:38245)
function CalendarsScheduleRow({ schedule }: CalendarsScheduleRowProps) {
  return (
    <div className="flex flex-col gap-0.5 border-primary border-l-3 py-1 pl-3">
      <Typography
        as="p"
        color="semantic.label.normal"
        variant="body2"
        weight="medium"
      >
        {schedule.title}
      </Typography>
      <Typography
        as="p"
        color="semantic.label.alternative"
        variant="caption1"
        weight="regular"
      >
        {formatSchedulePeriod(schedule.startDate, schedule.endDate)}
      </Typography>
    </div>
  );
}

export default CalendarsScheduleRow;
