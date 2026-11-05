export const notificationsKeys = {
  root: () => ["notifications"] as const,
  list: () => [...notificationsKeys.root(), "list"] as const,
  adminList: () => [...notificationsKeys.root(), "admin", "list"] as const,
};
