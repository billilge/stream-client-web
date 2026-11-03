export const feeKeys = {
  root: () => ["fee"] as const,
  payments: () => [...feeKeys.root(), "payments"] as const,
  myStatus: () => [...feeKeys.root(), "me"] as const,
};
