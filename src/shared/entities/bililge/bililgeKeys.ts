export const bililgeKeys = {
  root: () => ["bililge"] as const,
  items: () => [...bililgeKeys.root(), "items"] as const,
};
