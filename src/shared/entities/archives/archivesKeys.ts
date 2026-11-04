export const archivesKeys = {
  root: () => ["archives"] as const,
  list: () => [...archivesKeys.root(), "list"] as const,
  detail: (archiveId: number) =>
    [...archivesKeys.root(), "detail", archiveId] as const,
};
