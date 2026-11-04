export const archivesKeys = {
  root: () => ["archives"] as const,
  list: (keyword: string | null) =>
    [...archivesKeys.root(), "list", keyword] as const,
  detail: (archiveId: number) =>
    [...archivesKeys.root(), "detail", archiveId] as const,
};
