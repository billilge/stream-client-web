export const lockersKeys = {
  root: () => ["lockers"] as const,
  myAssignment: () => [...lockersKeys.root(), "assignment"] as const,
};
