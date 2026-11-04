export const billilgeKeys = {
  root: () => ["billilge"] as const,
  items: () => [...billilgeKeys.root(), "items"] as const,
};
