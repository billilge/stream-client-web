export const calendarsKeys = {
  root: () => ["calendars"] as const,
  schedules: (startDate: string, endDate: string) =>
    [...calendarsKeys.root(), "schedules", startDate, endDate] as const,
};
