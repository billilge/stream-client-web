export const noticesKeys = {
  root: () => ["notices"] as const,
  list: () => [...noticesKeys.root(), "list"] as const,
  detail: (noticeId: string) =>
    [...noticesKeys.root(), "detail", noticeId] as const,
};
