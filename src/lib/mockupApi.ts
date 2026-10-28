// 실 API가 붙기 전까지 entities의 queryFn·mutationFn이 목데이터를 서버 응답처럼 비동기로 돌려줄 때 쓴다.
// 개발 서버에서는 화면의 로딩 스켈레톤을 확인할 수 있게 일부러 늦게 응답하고, 배포 빌드에서는 바로 응답한다.
// 캐시·무효화는 TanStack Query가 맡아서 여기서는 지연만 준다. 실 API가 붙으면 안쪽을 api.get(...) 등으로 바꾼다.
const MOCK_DELAY_MS = 500;

// async 함수라 getData가 던진 에러(신청 취소 대상이 없을 때 등)는 거부된 Promise로 돌아간다
export async function mockupResponse<T>(getData: () => T): Promise<T> {
  if (import.meta.env.DEV) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  }
  return getData();
}
