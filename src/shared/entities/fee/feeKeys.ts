export const feeKeys = {
  root: () => ["fee"] as const,
  me: () => [...feeKeys.root(), "me"] as const,
  transferGuide: (remainingSemesters: number) =>
    [...feeKeys.root(), "transfer-guide", remainingSemesters] as const,
};
