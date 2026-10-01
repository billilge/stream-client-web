// 실 API가 붙기 전까지 entities의 API 함수가 목데이터를 서버 응답처럼 비동기로 돌려줄 때 쓴다.
// 개발 서버에서는 화면의 로딩 스켈레톤을 확인할 수 있게 일부러 늦게 응답하고, 배포 빌드에서는 바로 응답한다.
const MOCK_DELAY_MS = 500;

export function mockResponse<T>(data: T): Promise<T> {
  if (!import.meta.env.DEV) {
    return Promise.resolve(data);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), MOCK_DELAY_MS);
  });
}
