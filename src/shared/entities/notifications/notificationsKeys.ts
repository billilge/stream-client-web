export const notificationsKeys = {
  root: () => ["notifications"] as const,
  list: () => [...notificationsKeys.root(), "list"] as const,
};
