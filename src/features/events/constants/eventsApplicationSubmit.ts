export type EventsApplicationSubmitResult = "success" | "failure" | "closed";

// 실제 제출 API(POST /api/events/{eventId}/...)가 붙기 전까지 쓰는 목업이다.
// 실패·마감 화면을 확인하려면 이 값을 바꿔서 실행한다.
const MOCK_RESULT: EventsApplicationSubmitResult = "success";
const MOCK_DELAY_MS = 2600;

export function submitEventsApplication(): Promise<EventsApplicationSubmitResult> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RESULT), MOCK_DELAY_MS);
  });
}
