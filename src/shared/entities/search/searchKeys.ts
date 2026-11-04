export const searchKeys = {
  root: () => ["search"] as const,
  results: (keyword: string) => [...searchKeys.root(), keyword] as const,
};
