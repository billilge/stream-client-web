// 신청 뒤 sections() 하나로 구역 목록·상세를 같이 무효화한다
export const lockersKeys = {
  root: () => ["lockers"] as const,
  period: () => [...lockersKeys.root(), "period"] as const,
  sections: () => [...lockersKeys.root(), "sections"] as const,
  sectionList: (lockerPeriodId: number) =>
    [...lockersKeys.sections(), lockerPeriodId] as const,
  sectionDetail: (lockerPeriodId: number, sectionId: number) =>
    [...lockersKeys.sections(), lockerPeriodId, sectionId] as const,
  myApplications: () => [...lockersKeys.root(), "applications"] as const,
  myAssignment: () => [...lockersKeys.root(), "assignment"] as const,
};
