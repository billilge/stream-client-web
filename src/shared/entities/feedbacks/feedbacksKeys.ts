export const feedbacksKeys = {
  root: () => ["feedbacks"] as const,
  mine: () => [...feedbacksKeys.root(), "mine"] as const,
  myDetail: (feedbackId: string) =>
    [...feedbacksKeys.mine(), feedbackId] as const,
};
