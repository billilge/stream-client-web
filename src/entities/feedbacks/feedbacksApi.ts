import { MY_FEEDBACKS_MOCK } from "@/entities/feedbacks/feedbacksMock";
import type { MyFeedback } from "@/entities/feedbacks/types";
import { mockupApi } from "@/lib/mockupApi";

// 실 API가 붙으면 함수 안쪽만 요청 코드로 바꾼다 — 화면은 이 함수로만 데이터를 받는다.
export function fetchMyFeedbacks(): Promise<MyFeedback[]> {
  return mockupApi("feedbacks/mine", () => MY_FEEDBACKS_MOCK);
}

// 없는 피드백은 null — 상세 화면이 홈으로 보낸다.
export function fetchMyFeedback(
  feedbackId: string,
): Promise<MyFeedback | null> {
  return mockupApi(
    `feedbacks/mine/${feedbackId}`,
    () => MY_FEEDBACKS_MOCK.find((item) => item.id === feedbackId) ?? null,
  );
}
