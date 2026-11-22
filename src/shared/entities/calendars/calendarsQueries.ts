import { queryOptions } from "@tanstack/react-query";

import { mockupResponse } from "@/lib/mockupApi";
import { calendarsKeys } from "@/shared/entities/calendars/calendarsKeys";
import { CALENDARS_SCHEDULES } from "@/shared/entities/calendars/calendarsMock";

export const calendarsQueries = {
  // 기간(양 끝 포함)과 하루라도 겹치는 학사 일정. 서버에 API가 없어서 아직 목데이터다
  schedules: (startDate: string, endDate: string) =>
    queryOptions({
      queryKey: calendarsKeys.schedules(startDate, endDate),
      queryFn: () =>
        mockupResponse(() =>
          CALENDARS_SCHEDULES.filter(
            (schedule) =>
              schedule.startDate <= endDate && schedule.endDate >= startDate,
          ).sort(
            (a, b) =>
              a.startDate.localeCompare(b.startDate) ||
              a.endDate.localeCompare(b.endDate),
          ),
        ),
    }),
};
